import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchProducts, fetchCategories, cleanImageUrl } from "../utils/api";
import ProductCard from "../components/ProductCard";
import { TruckIcon, LockIcon, ReturnIcon, StarIcon } from "../components/Icons";
import "./HomePage.css";

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([fetchProducts({ limit: 24 }), fetchCategories()])
      .then(([prods, cats]) => {
        setFeatured(prods.slice(0, 8));
        setCategories(cats.slice(0, 6));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="container hero-content">
          <div className="hero-text fade-up">
            <span className="hero-eyebrow">New Arrivals 2025</span>
            <h1>Discover <span className="gradient-text">Curated</span><br />Products for You</h1>
            <p>Explore thousands of products across all categories, handpicked for quality and value.</p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-lg">Shop Now</Link>
              <Link to="/orders" className="btn btn-secondary btn-lg">My Orders</Link>
            </div>
            <div className="hero-stats">
              <div><span className="stat-num">10k+</span><span className="stat-label">Products</span></div>
              <div className="stat-div"></div>
              <div><span className="stat-num">50+</span><span className="stat-label">Categories</span></div>
              <div className="stat-div"></div>
              <div><span className="stat-num">Free</span><span className="stat-label">Delivery</span></div>
            </div>
          </div>
          <div className="hero-visual fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="hero-cards">
              {featured.slice(0, 3).map((p, i) => (
                <Link key={p.id} to={`/products/${p.id}`} className="hero-mini-card" style={{ animationDelay: `${0.3 + i * 0.12}s` }}>
                  <img
                    src={cleanImageUrl(p.images?.[0])}
                    alt={p.title}
                    onError={e => { e.target.src = "https://placehold.co/120x120/1a1a2e/7c5cfc?text=P"; }}
                  />
                  <div>
                    <div className="hmc-name">{p.title.slice(0, 24)}...</div>
                    <div className="hmc-price">${p.price}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
<section className="trust-bar">
  <div className="container trust-inner">
    {[[TruckIcon,"Free Shipping","On orders over $50"],[LockIcon,"Secure Payment","256-bit SSL encryption"],[ReturnIcon,"Easy Returns","30-day hassle-free returns"],[StarIcon,"Top Rated","Trusted by 100k+ customers"]].map(([Icon,title,sub]) => (
      <div key={title} className="trust-item">
        <span className="trust-icon"><Icon size={24} /></span>
        <div><strong>{title}</strong><span>{sub}</span></div>
      </div>
    ))}
  </div>
</section>

      {categories.length > 0 && (
        <section className="section container">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <Link to="/products" className="see-all">View all</Link>
          </div>
          <div className="categories-grid">
            {categories.map((cat, i) => (
              <button
                key={cat.id}
                className="cat-card fade-up"
                style={{ animationDelay: `${i * 0.06}s` }}
                onClick={() => navigate(`/products?categoryId=${cat.id}`)}
              >
                <img
                  src={cleanImageUrl(cat.image)}
                  alt={cat.name}
                  onError={e => { e.target.src = `https://placehold.co/200x140/1a1a2e/7c5cfc?text=${cat.name}`; }}
                />
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="section container">
        <div className="section-header">
          <h2>Featured Products</h2>
          <Link to="/products" className="see-all">View all</Link>
        </div>
        {loading ? (
          <div className="products-grid">
            {Array(8).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 340, borderRadius: 20 }} />)}
          </div>
        ) : (
          <div className="products-grid">
            {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </section>

      <section className="cta-banner container">
        <div className="cta-inner">
          <div>
            <h2>Ready to start shopping?</h2>
            <p>Browse our full catalog of products with real-time pricing.</p>
          </div>
          <Link to="/products" className="btn btn-primary btn-lg">Explore All Products</Link>
        </div>
      </section>
    </div>
  );
}
