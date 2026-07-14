import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Import Routes (Placeholders - we will build these next)
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json()); // Parses incoming JSON payloads

// Health check route
app.get("/", (req, res) => {
    res.status(200).json({ message: "ShopEz API Server is running smoothly!" });
});

// Mounting Endpoint Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// Database Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/shopez";

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("Connected successfully to MongoDB Atlas database.");
        // Start server only after a successful DB connection
        app.listen(PORT, () => {
            console.log(`Server is blasting off on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Database connection failed. Error details:", error.message);
    });