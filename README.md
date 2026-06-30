# 🛒 React E-Commerce Web Application

A modern, fully responsive E-Commerce web application built with **ReactJS**. This project replicates the core functionality of a real-world shopping platform, including product browsing, product details, shopping cart, checkout flow, and order history using the **Fake Store API by Platzi**.

---

## 🚀 Live Demo

```
https://your-live-demo.vercel.app
```

---

## 📂 GitHub Repository

```
https://github.com/Gouthamraju13/E-commerce-Web-Application
```

---

# 📌 Features

### 🏠 Home / Product Listing

- Fetch products dynamically from Platzi Fake API
- Display product image, title, price, and category
- Responsive product grid
- Product search
- Product filtering by category
- Product sorting
- Quick Add to Cart

---

### 📦 Product Details

- Large product image
- Product title
- Description
- Category
- Price
- Add to Cart
- Related products (optional)

---

### 🛒 Shopping Cart

- Add products to cart
- Update quantity
- Remove individual products
- Clear cart
- Cart total calculation
- Persistent cart using Local Storage

---

### 💳 Checkout (Mock)

- Order summary
- Billing information form
- Mock payment confirmation
- Place Order functionality

---

### 📋 My Orders

- View previous orders
- Order summary
- Order details
- Order date
- Total amount

---

### 🔍 Search & Filters

- Search products by title
- Filter by category
- Sort by:
  - Price (Low → High)
  - Price (High → Low)
  - Name (A → Z)
  - Name (Z → A)

---

# 🛠 Tech Stack

- ReactJS
- React Router DOM
- React Hooks
- Context API
- Axios
- CSS / Tailwind CSS
- Local Storage

---

# 📦 API Used
### Platzi Fake Store API
```
https://fakeapi.platzi.com/
```

### Endpoints

#### Get Products

```
GET /products
```

#### Get Categories

```
GET /categories
```

#### Get Single Product

```
GET /products/:id
```

---
# 📂 Project Structure

```
Shopwave/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── Footer.jsx
│   │   ├── Footer.css
│   │   ├── Navbar.jsx
│   │   ├── Navbar.css
│   │   ├── ProductCard.jsx
│   │   ├── ProductCard.css
│   │   ├── Toast.jsx
│   │   └── Icons.jsx
│   │
│   ├── context/
│   │   ├── CartContext.jsx
│   │   └── OrderContext.jsx
│   │
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── HomePage.css
│   │   ├── ProductsPage.jsx
│   │   ├── ProductsPage.css
│   │   ├── ProductDetailPage.jsx
│   │   ├── ProductDetailPage.css
│   │   ├── CartPage.jsx
│   │   ├── CartPage.css
│   │   ├── CheckoutPage.jsx
│   │   ├── CheckoutPage.css
│   │   ├── OrdersPage.jsx
│   │   └── OrdersPage.css
│   │
│   ├── utils/
│   │   └── api.js
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/Gouthamraju13/E-commerce-Web-Application.git
```

---

# 🧩 State Management

The application uses:

- React Context API
- React Hooks
  - useState
  - useEffect
  - useContext
  - useMemo
  - useReducer (optional)

Cart state is shared globally across the application.

---

# 📱 Responsive Design

The application is fully responsive and optimized for:

- Desktop
- Laptop
- Tablet
- Mobile

---

# 💾 Local Storage

Local Storage is used for:

- Shopping Cart
- Order History
- User Preferences (optional)

This ensures data remains available after refreshing the page.

---

# ✅ Functionalities Implemented

- Product Listing
- Product Details
- Dynamic API Integration
- Search Products
- Category Filtering
- Product Sorting
- Add to Cart
- Update Quantity
- Remove Item
- Cart Total Calculation
- Checkout Flow
- Order Summary
- Place Order
- My Orders
- Order Details
- Responsive UI
- Error Handling
- Loading States

---

# 🚀 Future Enhancements

- User Authentication
- Wishlist
- Product Ratings
- Product Reviews
- Coupon System
- Payment Gateway Integration
- Dark Mode
- Pagination
- Infinite Scroll

---

# 📄 License

This project is developed for educational and assessment purposes.
