/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const saved = localStorage.getItem("shopwave_orders");
  const [orders, setOrders] = useState(saved ? JSON.parse(saved) : []);

  useEffect(() => {
    localStorage.setItem("shopwave_orders", JSON.stringify(orders));
  }, [orders]);

  const placeOrder = (items, total, shippingInfo) => {
    const order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      items,
      total,
      shippingInfo,
      status: "Confirmed",
    };
    setOrders(prev => [order, ...prev]);
    return order;
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
