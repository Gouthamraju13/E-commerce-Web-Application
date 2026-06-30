const BASE = "https://api.escuelajs.co/api/v1";

// The public Platzi API is shared by thousands of developers worldwide who
// create test/junk entries (titles like "string", "8", "Tailwind"; images
// pointing at placehold.co, example.com, broken domains, etc). Rather than
// trying to blacklist every junk pattern (impossible — it's unbounded), we
// whitelist the image domains Platzi's own real seed data actually uses.
// Any product/category whose image isn't from a trusted photo host is
// dropped, since that's the most reliable signal of a "real" catalog entry.
const TRUSTED_IMAGE_HOSTS = [
  "i.imgur.com", "imgur.com",
];

const KNOWN_CATEGORIES = [
  "clothes", "clothing", "electronics", "furniture", "shoes",
  "miscellaneous", "shoe", "men's clothing", "women's clothing",
];

const hasTrustedImage = (url) => {
  if (!url) return false;
  try {
    const cleaned = url.replace(/[[\]"]/g, "").trim();
    const u = new URL(cleaned);
    return TRUSTED_IMAGE_HOSTS.includes(u.hostname.toLowerCase());
  } catch {
    return false;
  }
};

const isValidProduct = (p) =>
  p.images && p.images.length > 0 && hasTrustedImage(p.images[0]) &&
  p.title && p.title.trim().length >= 3 &&
  p.price > 0 && p.price < 100000;

const isValidCategory = (c) =>
  hasTrustedImage(c.image) &&
  KNOWN_CATEGORIES.includes((c.name || "").trim().toLowerCase());

export const fetchProducts = async ({ categoryId, offset = 0, limit = 20, title } = {}) => {
  let url = `${BASE}/products?offset=${offset}&limit=${limit}`;
  if (categoryId) url += `&categoryId=${categoryId}`;
  if (title) url += `&title=${encodeURIComponent(title)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  return data.filter(isValidProduct);
};

export const fetchProduct = async (id) => {
  const res = await fetch(`${BASE}/products/${id}`);
  if (!res.ok) throw new Error("Product not found");
  return res.json();
};

export const fetchCategories = async () => {
  const res = await fetch(`${BASE}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  const data = await res.json();
  return data.filter(isValidCategory);
};

export const cleanImageUrl = (raw) => {
  if (!raw) return "https://placehold.co/400x400/1a1a2e/ffffff?text=No+Image";
  const cleaned = raw.replace(/[[\]"]/g, "").trim();
  try {
    new URL(cleaned);
    return cleaned;
  } catch {
    return "https://placehold.co/400x400/1a1a2e/ffffff?text=No+Image";
  }
};