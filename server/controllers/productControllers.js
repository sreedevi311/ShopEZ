import { Product } from "../models/productSchema.js";

// GET ALL PRODUCTS (With Optional Filtering)
export const getAllProducts = async (req, res) => {
    try {
        const { category, gender, search } = req.query; // Add search param parsing
        let filterOptions = {};

        if (category && category !== "undefined" && category !== "null") {
            filterOptions.category = { $regex: new RegExp(category.trim(), "i") };
        }

        if (gender && gender !== "undefined" && gender !== "null") {
            filterOptions.gender = { $regex: new RegExp("^" + gender.trim() + "$", "i") };
        }

        // Search bar support: check if query matches title OR description keywords
        if (search && search.trim() !== "") {
            filterOptions.$or = [
                { title: { $regex: new RegExp(search.trim(), "i") } },
                { description: { $regex: new RegExp(search.trim(), "i") } }
            ];
        }

        const products = await Product.find(filterOptions);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products.", error: error.message });
    }
};

// GET SINGLE PRODUCT BY ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product details.", error: error.message });
    }
};

// CREATE PRODUCT (Admin Only)
export const createProduct = async (req, res) => {
    try {
        const { title, description, mainimg, carousel, sizes, category, gender, price, discount } = req.body;

        if (!title || !description || !mainimg || !price || !category || !gender) {
            return res.status(400).json({ message: "Missing required product fields." });
        }

        const newProduct = new Product({
            title,
            description,
            mainimg,
            carousel: carousel || [mainimg],
            sizes: sizes || [],
            category,
            gender,
            price,
            discount: discount || 0
        });

        await newProduct.save();
        res.status(201).json({ message: "Product added to catalog successfully!", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Failed to create product.", error: error.message });
    }
};

// UPDATE PRODUCT (Admin Only)
export const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found to update." });
        }

        res.status(200).json({ message: "Product updated successfully!", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Failed to update product.", error: error.message });
    }
};

// DELETE PRODUCT (Admin Only)
export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found to delete." });
        }
        res.status(200).json({ message: "Product removed from catalog safely." });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete product.", error: error.message });
    }
};