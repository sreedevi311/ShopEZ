import express from "express";
import { 
    getAllProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} from "../controllers/productControllers.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public Routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Admin Protected Routes
router.post("/", verifyAdmin, createProduct);
router.put("/:id", verifyAdmin, updateProduct);
router.delete("/:id", verifyAdmin, deleteProduct);

export default router;