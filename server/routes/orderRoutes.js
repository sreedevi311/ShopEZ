import express from "express";
import { 
    checkoutOrder, 
    getMyOrders, 
    getAllOrders, 
    updateOrderStatus 
} from "../controllers/orderControllers.js";
import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Customer Transaction Endpoints (Requires Login token)
router.post("/checkout", verifyToken, checkoutOrder);
router.get("/my-orders", verifyToken, getMyOrders);

// Admin Management Endpoints (Requires Admin role)
router.get("/all-orders", verifyAdmin, getAllOrders);
router.put("/status/:id", verifyAdmin, updateOrderStatus);

export default router;