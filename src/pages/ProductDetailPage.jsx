import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchProduct, fetchProducts, cleanImageUrl } from "../utils/api";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import { SearchOffIcon } from "../components/Icons";
import "./ProductDetailPage.css";

function fakeRating(id) { return (3.5 + (id % 5) * 0.3).toFixed(1); }
function fakeReviews(id) { return 40 + (id % 60); }

const REVIEWS = ["Great quality!", "Exactly as described.", "Fast delivery, love it.", "Worth every penny!", "Highly recommend."];

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("desc");
  const { dispatch, items } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;

    fetchProduct(id)
      .then(p => {
        if (ignore) return null;
        setProduct(p);
        setNotFound(false);
        setActiveImg(0);
        return fetchProducts({ categoryId: p.category?.id, limit: 5 });
      })
      .then(rel => {
        if (!ignore && rel) setRelated(rel.filter(r => r.id !== +id).slice(0, 4));
      })
      .catch(error => {
        console.error(error);
        if (!ignore) setNotFound(true);
      });

    window.scrollTo(0, 0);
    return () => { ignore = true; };
  }, [id]);

  const isLoading = !notFound && product?.id !== Number(id);
  const inCart = product && items.some(i => i.id === product.id);

  const handleAdd = () => {
    for (let i = 0; i < qty; i += 1) dispatch({ type: "ADD_ITEM", payload: product });
  };
  const handleBuyNow = () => {
    handleAdd();
    navigate("/cart");
  };

  if (isLoading) return (
    <div className="container detail-skeleton">
      <div className="skeleton" style={{ height: 500, borderRadius: 20 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
        {[60, 200, 140, 80, 50].map((h, i) => <div key={i} className="skeleton" style={{ height: h, borderRadius: 12 }} />)}
      </div>
    </div>
  );

  if (!product || notFound) return (
    <div className="container empty-state" style={{ paddingTop: 80 }}>
      <div className="icon"><SearchOffIcon /></div>
      <h3>Product not found</h3>
      <Link to="/products" className="btn btn-primary">Back to Shop</Link>
    </div>
  );

  const images = product.images?.map(cleanImageUrl).filter(Boolean) || [];
  const rating = fakeRating(product.id);
  const reviewCount = fakeReviews(product.id);

  return (
    <div className="product-detail container">
      <div className="breadcrumb">
        <Link to="/">Home</Link><span>/</span>
        <Link to="/products">Products</Link><span>/</span>
        {product.category && <><Link to={`/products?categoryId=${product.category.id}`}>{product.category.name}</Link><span>/</span></>}
        <span>{product.title}</span>
      </div>

      <div className="detail-layout">
        <div className="detail-images fade-in">
          <div className="main-image">
            <img
              src={images[activeImg] || "https://placehold.co/600x600/1a1a2e/7c5cfc?text=Product"}
              alt={product.title}
              onError={e => { e.target.src = "https://placehold.co/600x600/1a1a2e/7c5cfc?text=Product"; }}
            />
          </div>
          {images.length > 1 && (
            <div className="thumb-row">
              {images.map((img, i) => (
                <button key={img} className={`thumb ${activeImg === i ? "active" : ""}`} onClick={() => setActiveImg(i)}>
                  <img src={img} alt="" onError={e => { e.target.src = "https://placehold.co/80x80/1a1a2e/7c5cfc?text=P"; }} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="detail-info fade-up">
          <span className="detail-category">{product.category?.name}</span>
          <h1 className="detail-title">{product.title}</h1>

          <div className="detail-rating">
            <div className="stars">{[1, 2, 3, 4, 5].map(s => <span key={s} style={{ opacity: s <= Math.round(+rating) ? 1 : 0.25 }}>★</span>)}</div>
            <span>{rating} / 5.0</span>
            <span className="sep">·</span>
            <span>{reviewCount} reviews</span>
          </div>

          <div className="detail-price">
            <span className="price-main">${product.price.toFixed(2)}</span>
            <span className="price-orig">${(product.price * 1.3).toFixed(2)}</span>
            <span className="discount">30% off</span>
          </div>

          <div className="detail-qty-row">
            <label>Quantity</label>
            <div className="qty-control">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>
          </div>

          <div className="detail-actions">
            <button className="btn btn-primary btn-lg" onClick={handleAdd}>
              {inCart ? "Add More to Cart" : "Add to Cart"}
            </button>
            <button className="btn btn-secondary btn-lg" onClick={handleBuyNow}>Buy Now</button>
          </div>

          {inCart && (
            <Link to="/cart" className="btn btn-ghost" style={{ marginTop: 8 }}>
              View cart →
            </Link>
          )}

          <div className="tabs">
            <div className="tab-nav">
              {["desc", "details", "reviews"].map(t => (
                <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>
                  {t === "desc" ? "Description" : t === "details" ? "Details" : "Reviews"}
                </button>
              ))}
            </div>
            <div className="tab-body">
              {tab === "desc" && <p>{product.description || "No description available."}</p>}
              {tab === "details" && (
                <table className="details-table">
                  <tbody>
                    <tr><td>Category</td><td>{product.category?.name || "-"}</td></tr>
                    <tr><td>Product ID</td><td>#{product.id}</td></tr>
                    <tr><td>Price</td><td>${product.price}</td></tr>
                    <tr><td>Availability</td><td className="in-stock">In Stock</td></tr>
                    <tr><td>Delivery</td><td>2–5 business days</td></tr>
                  </tbody>
                </table>
              )}
              {tab === "reviews" && (
                <div className="reviews-list">
                  {REVIEWS.slice(0, 3).map((r, i) => (
                    <div key={r} className="review-item">
                      <div className="review-header">
                        <span className="reviewer">Customer {product.id + i}</span>
                        <div className="stars" style={{ fontSize: 12 }}>{"★".repeat(4 + i % 2)}{"☆".repeat(1 - i % 2)}</div>
                      </div>
                      <p>{r}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="related-section">
          <h2 className="related-title">You might also like</h2>
          <div className="related-grid">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}