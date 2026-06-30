import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import { cleanImageUrl } from "../utils/api";
import "./CheckoutPage.css";

const STEPS = ["Shipping", "Payment", "Review", "Confirmed"];

function validate(form, step) {
  const errs = {};
  if (step === 0) {
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim() || !form.email.includes("@")) errs.email = "Valid email required";
    if (!form.address.trim()) errs.address = "Address is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.zip.trim()) errs.zip = "ZIP is required";
  }
  if (step === 1) {
    if (!form.cardName.trim()) errs.cardName = "Cardholder name required";
    if (form.cardNum.replace(/\s/g, "").length !== 16) errs.cardNum = "Enter 16-digit card number";
    if (!form.expiry.match(/^\d{2}\/\d{2}$/)) errs.expiry = "Format: MM/YY";
    if (!form.cvv.match(/^\d{3,4}$/)) errs.cvv = "3-4 digit CVV";
  }
  return errs;
}

function FormField({ field, label, placeholder, type = "text", half, value, error, onChange }) {
  return (
    <div className={`form-field ${half ? "half" : ""} ${error ? "error" : ""}`}>
      <label>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(field, e.target.value)}
      />
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

export default function CheckoutPage() {
  const { items, totalPrice, dispatch } = useCart();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState(null);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", city: "", state: "", zip: "", country: "India",
    cardName: "", cardNum: "", expiry: "", cvv: "", saveCard: false,
  });

  useEffect(() => {
    if (items.length === 0 && step < 3) navigate("/cart", { replace: true });
  }, [items.length, navigate, step]);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  };

  const shipping = totalPrice >= 50 ? 0 : 9.99;
  const tax = totalPrice * 0.08;
  const grand = totalPrice + shipping + tax;

  const next = () => {
    const errs = validate(form, step);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    if (step === 2) {
      const placed = placeOrder(items, grand, form);
      setOrder(placed);
      dispatch({ type: "CLEAR_CART" });
    }
    setStep(s => s + 1);
  };

  if (items.length === 0 && step < 3) return null;

  return (
    <div className="checkout-page container">
      <div className="checkout-steps">
        {STEPS.map((s, i) => (
          <div key={s} className={`step ${i < step ? "done" : i === step ? "active" : ""}`}>
            <div className="step-dot">{i < step ? "OK" : i + 1}</div>
            <span>{s}</span>
            {i < STEPS.length - 1 && <div className="step-line" />}
          </div>
        ))}
      </div>

      {step < 3 ? (
        <div className="checkout-layout">
          <div className="checkout-form">
            {step === 0 && (
              <div className="form-section fade-up">
                <h2>Shipping Information</h2>
                <div className="form-grid">
                  <FormField field="name" label="Full Name" placeholder="John Doe" value={form.name} error={errors.name} onChange={set} />
                  <FormField field="email" label="Email" placeholder="john@example.com" type="email" value={form.email} error={errors.email} onChange={set} />
                  <FormField field="phone" label="Phone" placeholder="+91 9876543210" value={form.phone} error={errors.phone} onChange={set} />
                  <FormField field="address" label="Address" placeholder="123 Main St" value={form.address} error={errors.address} onChange={set} />
                  <FormField field="city" label="City" placeholder="Mumbai" half value={form.city} error={errors.city} onChange={set} />
                  <FormField field="state" label="State" placeholder="Maharashtra" half value={form.state} error={errors.state} onChange={set} />
                  <FormField field="zip" label="ZIP Code" placeholder="400001" half value={form.zip} error={errors.zip} onChange={set} />
                  <div className="form-field half">
                    <label>Country</label>
                    <select value={form.country} onChange={e => set("country", e.target.value)}>
                      {["India", "United States", "United Kingdom", "Canada", "Australia"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="form-section fade-up">
                <h2>Payment Details</h2>
                <div className="card-mock">
                  <div className="card-chip">CARD</div>
                  <div className="card-num-display">{form.cardNum || "0000 0000 0000 0000"}</div>
                  <div className="card-bottom">
                    <span>{form.cardName || "YOUR NAME"}</span>
                    <span>{form.expiry || "MM/YY"}</span>
                  </div>
                </div>
                <div className="form-grid">
                  <FormField field="cardName" label="Cardholder Name" placeholder="As on card" value={form.cardName} error={errors.cardName} onChange={set} />
                  <div className={`form-field ${errors.cardNum ? "error" : ""}`}>
                    <label>Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      value={form.cardNum}
                      onChange={e => {
                        const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                        set("cardNum", v.replace(/(.{4})/g, "$1 ").trim());
                      }}
                    />
                    {errors.cardNum && <span className="field-error">{errors.cardNum}</span>}
                  </div>
                  <FormField field="expiry" label="Expiry" placeholder="MM/YY" half value={form.expiry} error={errors.expiry} onChange={set} />
                  <FormField field="cvv" label="CVV" placeholder="123" half type="password" value={form.cvv} error={errors.cvv} onChange={set} />
                </div>
                <div className="mock-note">This is a mock checkout. No real payment is processed.</div>
              </div>
            )}

            {step === 2 && (
              <div className="form-section fade-up">
                <h2>Review Your Order</h2>
                <div className="review-items">
                  {items.map(item => (
                    <div key={item.id} className="review-item-row">
                      <img
                        src={cleanImageUrl(item.images?.[0])}
                        alt={item.title}
                        onError={e => { e.target.src = "https://placehold.co/60x60/1a1a2e/7c5cfc?text=P"; }}
                      />
                      <div>
                        <div className="ri-title">{item.title}</div>
                        <div className="ri-meta">Qty: {item.qty} x ${item.price.toFixed(2)}</div>
                      </div>
                      <span className="ri-subtotal">${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="review-address">
                  <h4>Delivering to:</h4>
                  <p>{form.name}</p>
                  <p>{form.address}, {form.city}, {form.state} {form.zip}</p>
                  <p>{form.country}</p>
                </div>
              </div>
            )}

            <div className="form-nav">
              {step > 0 && <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>Back</button>}
              <button className="btn btn-primary btn-lg" onClick={next}>
                {step === 2 ? "Place Order" : "Continue"}
              </button>
            </div>
          </div>

          <aside className="checkout-summary">
            <h3>Order Summary</h3>
            {items.map(item => (
              <div key={item.id} className="cs-item">
                <img
                  src={cleanImageUrl(item.images?.[0])}
                  alt=""
                  onError={e => { e.target.src = "https://placehold.co/48x48/1a1a2e/7c5cfc?text=P"; }}
                />
                <div className="cs-name">{item.title.slice(0, 30)}...</div>
                <span className="cs-qty">x{item.qty}</span>
                <span className="cs-price">${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
            <div className="divider" />
            <div className="cs-row"><span>Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
            <div className="cs-row"><span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
            <div className="cs-row"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
            <div className="cs-total"><span>Total</span><span>${grand.toFixed(2)}</span></div>
          </aside>
        </div>
      ) : (
        <div className="confirmed fade-up">
          <div className="confirmed-icon">Done</div>
          <h2>Order Confirmed!</h2>
          <p>Thank you, {form.name}! Your order <strong>{order?.id}</strong> has been placed.</p>
          <p className="conf-sub">A confirmation would be sent to <strong>{form.email}</strong>.</p>
          <div className="confirmed-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate("/orders")}>View My Orders</button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate("/products")}>Continue Shopping</button>
          </div>
        </div>
      )}
    </div>
  );
}
