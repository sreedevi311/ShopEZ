
# 🛍️ ShopEz – Premium E-Commerce Marketplace

> A modern **MERN Stack** fashion e-commerce application featuring secure authentication, dynamic storefront customization, shopping cart management, order tracking, and an admin logistics dashboard.

---

## ✨ Features

- 🔐 JWT Authentication & bcrypt Password Hashing
- 👤 User Registration & Login
- 🛍️ Product Catalog with Category, Gender & Search Filters
- 🔍 Live Search Suggestions
- 🖼️ Product Image Gallery & Size Selection
- 🛒 Shopping Bag & Quantity Management
- 💳 Checkout & Order Placement
- 📦 Order Tracking & Purchase History
- 🎨 Dynamic Homepage Banner & Navigation Configuration
- ⚙️ Admin Dashboard for Products, Orders & Store Customization

---

# 🛠️ Tech Stack

| Frontend | Backend | Database | Tools |
|----------|----------|----------|------|
| React, Vite, React Router, CSS | Node.js, Express.js | MongoDB Atlas, Mongoose | JWT, bcrypt, Multer, Axios |

---

# 🏗️ Architecture

```
React (Vite)
      │
      ▼
Express REST API
      │
Controllers → Middleware → Routes
      │
Mongoose ODM
      │
MongoDB Atlas
```

---

# 📁 Folder Structure

```text
client/
├── public/
└── src/
    ├── api/
    ├── components/
    ├── context/
    ├── views/
    ├── App.jsx
    └── main.jsx

server/
├── controllers/
├── middleware/
├── models/
├── routes/
├── .env
└── server.js
```

---

# 🚀 Installation

```bash
git clone https://github.com/<your-username>/shopez.git
cd shopez
```

### Backend

```bash
cd server
npm install
```

Create `.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ShopEz
JWT_SECRET=your_secure_secret
```

Run backend

```bash
node server
```

### Frontend

```bash
cd ../client
npm install
npm run dev
```

---

# 🔌 API Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products` | GET | Fetch products with filters |
| `/api/cart/add` | POST | Add item to cart |
| `/api/orders` | POST | Place order |
| `/api/auth/login` | POST | Login |
| `/api/auth/register` | POST | Register |

---

# 🔒 Authentication

- bcrypt password hashing
- JWT-based authentication
- Protected routes
- Authorization middleware
- Session validation through bearer tokens

---

# 🖥️ User Interface

- Premium landing page
- Responsive product catalog
- Product details with gallery & size selector
- Shopping bag
- Checkout
- Order history
- Admin dashboard

---

# 🧪 Testing

- Unit Testing
- Integration Testing
- End-to-End Testing using Thunder Client/Postman

---

# ⚠️ Known Issues

- Incorrect MongoDB database name in URI creates collections in `test`
- Deprecated Mongoose update options should be replaced
- Product carousel images should stay synchronized with main image

---

# 🚀 Future Enhancements

- Razorpay / Stripe / PayPal Integration
- Email & SMS Notifications
- Analytics Dashboard
- Wishlist
- Product Reviews & Ratings
- Coupons & Offers

---

# 📜 License

This project is intended for educational and portfolio purposes.
