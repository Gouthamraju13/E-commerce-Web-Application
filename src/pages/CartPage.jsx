import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { cleanImageUrl } from "../utils/api";
import { CartIcon, TrashIcon, LockIcon } from "../components/Icons";
import "./CartPage.css";

export default function CartPage() {
  const { items, dispatch, totalPrice } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) return (
    <div className="container">
      <div className="empty-state" style={{ paddingTop: 80 }}>
        <div className="icon">Cart</div>
        <h3>Your cart is empty</h3>
        <p>Add some products to get started.</p>
        <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
      </div>
    </div>
  );

  const shipping = totalPrice >= 50 ? 0 : 9.99;
  const tax = totalPrice * 0.08;
  const grand = totalPrice + shipping + tax;

  return (
    <div className="cart-page container">
      <div className="page-header">
        <h1>Shopping Cart</h1>
        <p>{items.length} item{items.length !== 1 ? "s" : ""}</p>
      </div>
      <div className="icon"><CartIcon /></div>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map(item => (
            <div key={item.id} className="cart-item fade-up">
              <Link to={`/products/${item.id}`} className="ci-image">
                <img
                  src={cleanImageUrl(item.images?.[0])}
                  alt={item.title}
                  onError={e => { e.target.src = "https://placehold.co/120x120/1a1a2e/7c5cfc?text=P"; }}
                />
              </Link>
              <div className="ci-info">
                <Link to={`/products/${item.id}`} className="ci-title">{item.title}</Link>
                <span className="ci-category">{item.category?.name}</span>
                <span className="ci-price">${item.price.toFixed(2)} each</span>
              </div>
              <div className="ci-controls">
                <div className="qty-control">
                  <button onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: item.id, qty: item.qty - 1 } })}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: item.id, qty: item.qty + 1 } })}>+</button>
                </div>
                <span className="ci-total">${(item.price * item.qty).toFixed(2)}</span>
                <button className="ci-remove" onClick={()=>dispatch({type:"REMOVE_ITEM",payload:item.id})} title="Remove"><TrashIcon /></button>
              </div>
            </div>
          ))}

          <div className="cart-actions">
            <Link to="/products" className="btn btn-ghost">Back to Shopping</Link>
            <button className="btn btn-danger" onClick={() => dispatch({ type: "CLEAR_CART" })}>Clear Cart</button>
          </div>
        </div>

        <aside className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-rows">
            <div className="summary-row"><span>Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? <span className="free">Free</span> : `$${shipping.toFixed(2)}`}</span></div>
            <div className="summary-row"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
            {shipping > 0 && <p className="shipping-note">Add ${(50 - totalPrice).toFixed(2)} more for free shipping</p>}
          </div>
          <div className="divider" />
          <div className="summary-total"><span>Total</span><span>${grand.toFixed(2)}</span></div>
          <button
            className="btn btn-primary btn-lg"
            style={{ width: "100%", justifyContent: "center", marginTop: 20 }}
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
          <div className="secure-note"><LockIcon /> Secure checkout · SSL encrypted</div>
        </aside>
      </div>
    </div>
  );
}
