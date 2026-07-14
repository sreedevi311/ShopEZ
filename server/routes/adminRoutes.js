import express from "express";
import { getStoreConfig, updateStoreConfig } from "../controllers/adminControllers.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Publicly available to load layout assets on app launch
router.get("/config", getStoreConfig);

// Shielded dynamically from typical users
router.put("/config", verifyAdmin, updateStoreConfig);

export default router;