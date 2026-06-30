import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { cleanImageUrl } from "../utils/api";
import "./ProductCard.css";

const STARS = [1, 2, 3, 4, 5];
function fakeRating(id) { return 3.5 + (id % 5) * 0.3; }
function fakeReviews(id) { return 40 + (id % 60); }

export default function ProductCard({ product, index = 0 }) {
  const { dispatch, items } = useCart();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const inCart = items.some(i => i.id === product.id);
  const rating = fakeRating(product.id);
  const reviews = fakeReviews(product.id);
  const imgUrl = imgError
    ? "https://placehold.co/400x400/1a1a2e/7c5cfc?text=Product"
    : cleanImageUrl(product.images?.[0]);

  const handleAdd = (e) => {
    e.preventDefault();
    dispatch({ type: "ADD_ITEM", payload: product });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="product-card fade-up" style={{ animationDelay: `${index * 0.05}s` }}>
      <Link to={`/products/${product.id}`} className="card-image-wrap">
        <img src={imgUrl} alt={product.title} loading="lazy" onError={() => setImgError(true)} />
        <span className="card-category">{product.category?.name || "General"}</span>
        {inCart && <span className="card-in-cart">In Cart</span>}
      </Link>
      <div className="card-body">
        <Link to={`/products/${product.id}`}>
          <h3 className="card-title">{product.title}</h3>
        </Link>
        <div className="card-rating">
          <div className="stars">
            {STARS.map(s => (
              <span key={s} style={{ opacity: s <= Math.round(rating) ? 1 : 0.25 }}>*</span>
            ))}
          </div>
          <span className="rating-count">({reviews})</span>
        </div>
        <div className="card-footer">
          <span className="card-price">${product.price.toFixed(2)}</span>
          <button
            className={`btn btn-sm ${added ? "btn-success" : "btn-primary"} add-btn`}
            onClick={handleAdd}
          >
            {added ? "Added!" : inCart ? "+ More" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
