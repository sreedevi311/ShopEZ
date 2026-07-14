import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import Home from "./views/Home";
import Catalog from "./views/Catalog";
import ProductDetail from "./views/ProductDetail";
import Login from "./views/Login";
import Register from "./views/Register";
import Cart from "./views/Cart";
import OrderHistory from "./views/OrderHistory";
import AdminDashboard from "./views/AdminDashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routing Channels */}
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Customer Exclusive Protected Channels */}
          <Route path="/cart" element={<ProtectedRoute allowedRoles={["customer", "admin"]}><Cart /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute allowedRoles={["customer", "admin"]}><OrderHistory /></ProtectedRoute>} />

          {/* Management Exclusive Protected Channels */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;