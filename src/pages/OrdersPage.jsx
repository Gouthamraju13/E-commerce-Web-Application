import { useState } from "react";
import { Link } from "react-router-dom";
import { useOrders } from "../context/OrderContext";
import { cleanImageUrl } from "../utils/api";
import { PackageIcon } from "../components/Icons";
import "./OrdersPage.css";

export default function OrdersPage() {
  const { orders } = useOrders();
  const [selected, setSelected] = useState(null);

  if (orders.length === 0) return (
    <div className="container">
      <div className="empty-state">
        <div className="icon"><PackageIcon /></div>
        <h3>No orders yet</h3>
        <p>When you place orders, they'll appear here.</p>
        <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
      </div>
    </div>
  );

  const order = selected ? orders.find(o => o.id === selected) : null;

  return (
    <div className="orders-page container">
      <div className="page-header">
        <h1>My Orders</h1>
        <p>{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
      </div>

      <div className="orders-layout">
        <div className="orders-list">
          {orders.map(o => (
            <div
              key={o.id}
              className={`order-card ${selected === o.id ? "active" : ""}`}
              onClick={() => setSelected(o.id === selected ? null : o.id)}
            >
              <div className="order-card-header">
                <div>
                  <span className="order-id">{o.id}</span>
                  <span className="order-date">
                    {new Date(o.date).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                </div>
                <span className={`order-status ${o.status.toLowerCase()}`}>{o.status}</span>
              </div>
              <div className="order-items-preview">
                {o.items.slice(0, 3).map(item => (
                  <img
                    key={item.id}
                    src={cleanImageUrl(item.images?.[0])}
                    alt={item.title}
                    onError={e => { e.target.src = "https://placehold.co/40x40/1a1a2e/7c5cfc?text=P"; }}
                  />
                ))}
                {o.items.length > 3 && <div className="more-items">+{o.items.length - 3}</div>}
              </div>
              <div className="order-card-footer">
                <span>{o.items.reduce((s, i) => s + i.qty, 0)} items</span>
                <span className="order-total">${o.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        {order ? (
          <div className="order-detail fade-in">
            <div className="od-header">
              <div>
                <h2>{order.id}</h2>
                <span className="order-date">{new Date(order.date).toLocaleString()}</span>
              </div>
              <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span>
            </div>

            <div className="od-section">
              <h3>Items Ordered</h3>
              {order.items.map(item => (
                <div key={item.id} className="od-item">
                  <img
                    src={cleanImageUrl(item.images?.[0])}
                    alt={item.title}
                    onError={e => { e.target.src = "https://placehold.co/56x56/1a1a2e/7c5cfc?text=P"; }}
                  />
                  <div className="od-item-info">
                    <Link to={`/products/${item.id}`} className="od-item-title">{item.title}</Link>
                    <span>Qty: {item.qty} x ${item.price.toFixed(2)}</span>
                  </div>
                  <span className="od-item-total">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="od-section">
              <h3>Shipping Address</h3>
              <div className="od-address">
                <p><strong>{order.shippingInfo?.name}</strong></p>
                <p>{order.shippingInfo?.address}</p>
                <p>{order.shippingInfo?.city}, {order.shippingInfo?.state} {order.shippingInfo?.zip}</p>
                <p>{order.shippingInfo?.country}</p>
                <p>{order.shippingInfo?.email}</p>
              </div>
            </div>

            <div className="od-totals">
              <div className="od-total-row"><span>Total Paid</span><span className="od-total-price">${order.total.toFixed(2)}</span></div>
            </div>

            <Link to="/products" className="btn btn-primary" style={{ marginTop: 16 }}>Shop Again</Link>
          </div>
        ) : (
          <div className="od-placeholder">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom:16, opacity:0.5}}>
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="11 18 5 12 11 6"></polyline>
            </svg>
            <p>Select an order to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}