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
  "miscellaneous", "shoe", "shoesk", "men's clothing", "women's clothing",
];

const CLOTHES_CATEGORY_ID = "1";
const CLOTHES_CATEGORY_NAMES = ["clothes", "clothing", "men's clothing", "women's clothing"];
const FOOTWEAR_CATEGORY_ID = "4";
const FOOTWEAR_CATEGORY_NAMES = ["shoes", "shoe", "shoesk", "footwear"];

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

const isClothesCategory = (category) =>
  String(category?.id) === CLOTHES_CATEGORY_ID ||
  CLOTHES_CATEGORY_NAMES.includes((category?.name || "").trim().toLowerCase());

const normalizeCategory = (category) => {
  if (!category) return category;
  const name = (category.name || "").trim().toLowerCase();
  if (String(category.id) === FOOTWEAR_CATEGORY_ID || FOOTWEAR_CATEGORY_NAMES.includes(name)) {
    return { ...category, name: "Footwear" };
  }
  return category;
};

const normalizeProduct = (product) => ({
  ...product,
  category: normalizeCategory(product.category),
});

const limitClothesProducts = (products) => {
  let clothesCount = 0;

  return products.filter((product) => {
    if (!isClothesCategory(product.category)) return true;
    clothesCount += 1;
    return clothesCount === 1;
  });
};

export const fetchProducts = async ({ categoryId, offset = 0, limit = 20, title } = {}) => {
  const catalogLimit = Math.max(200, offset + limit);
  let url = `${BASE}/products?offset=0&limit=${catalogLimit}`;
  if (categoryId) url += `&categoryId=${categoryId}`;
  if (title) url += `&title=${encodeURIComponent(title)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  const products = data.filter(isValidProduct).map(normalizeProduct);

  if (String(categoryId) === CLOTHES_CATEGORY_ID) {
    return products.slice(0, 1).slice(offset, offset + limit);
  }

  return limitClothesProducts(products).slice(offset, offset + limit);
};

export const fetchProduct = async (id) => {
  const res = await fetch(`${BASE}/products/${id}`);
  if (!res.ok) throw new Error("Product not found");
  const product = await res.json();
  return normalizeProduct(product);
};

export const fetchCategories = async () => {
  const res = await fetch(`${BASE}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  const data = await res.json();
  return data.filter(isValidCategory).map(normalizeCategory);
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
