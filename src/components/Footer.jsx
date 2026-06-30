import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="footer-logo"><span className="logo-icon">◈</span> ShopWave</div>
          <p>A modern e-commerce experience built with React & Platzi Fake API.</p>
        </div>
        <div className="footer-links">
          <div>
            <h4>Shop</h4>
            <Link to="/products">All Products</Link>
            <Link to="/products?categoryId=2">Electronics</Link>
            <Link to="/products?categoryId=1">Clothing</Link>
          </div>
          <div>
            <h4>Account</h4>
            <Link to="/cart">Cart</Link>
            <Link to="/orders">My Orders</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 ShopWave.</p>
      </div>
    </footer>
  );
}
