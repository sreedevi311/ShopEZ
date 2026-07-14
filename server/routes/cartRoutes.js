import express from "express";
import { 
    getCart, 
    addToCart, 
    updateCartItem, 
    removeCartItem, 
    clearCart 
} from "../controllers/cartControllers.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply verifyToken middleware globally to all endpoints under this router
router.use(verifyToken);

router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update/:id", updateCartItem);
router.delete("/remove/:id", removeCartItem);
router.delete("/clear", clearCart);

export default router;