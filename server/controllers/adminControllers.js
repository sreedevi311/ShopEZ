import { Admin } from "../models/adminSchema.js";

// GET GLOBAL STORE CONFIG (Public)
export const getStoreConfig = async (req, res) => {
    try {
        const storeConfig = await Admin.findOne({});
        if (!storeConfig) {
            return res.status(404).json({ message: "Store configuration metadata not found." });
        }
        res.status(200).json(storeConfig);
    } catch (error) {
        res.status(500).json({ message: "Error fetching storefront configuration.", error: error.message });
    }
};

// UPDATE GLOBAL STORE CONFIG (Admin Only)
export const updateStoreConfig = async (req, res) => {
    try {
        const { banner, categories } = req.body;

        const updatedConfig = await Admin.findOneAndUpdate(
            {}, 
            { $set: { banner, categories } },
            { new: true, upsert: true }
        );

        res.status(200).json({
            message: "Storefront global config metadata updated successfully!",
            config: updatedConfig
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to update store configuration.", error: error.message });
    }
};