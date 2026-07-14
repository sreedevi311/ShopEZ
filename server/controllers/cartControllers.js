import { Cart } from "../models/cartSchema.js";

// GET CURRENT USER'S CART ITEMS
export const getCart = async (req, res) => {
    try {
        const userCart = await Cart.find({ userId: req.user.userId });
        res.status(200).json(userCart);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving cart.", error: error.message });
    }
};

// ADD PRODUCT TO CART
export const addToCart = async (req, res) => {
    try {
        const { title, description, mainImg, size, quantity, price, discount } = req.body;

        if (!title || !mainImg || !size || !price) {
            return res.status(400).json({ message: "Missing item configuration details." });
        }

        let existingCartItem = await Cart.findOne({
            userId: req.user.userId,
            title: title,
            size: size
        });

        if (existingCartItem) {
            existingCartItem.quantity += quantity || 1;
            await existingCartItem.save();
            return res.status(200).json({ message: "Cart quantity updated!", item: existingCartItem });
        }

        const newCartItem = new Cart({
            userId: req.user.userId,
            title,
            description,
            mainImg,
            size,
            quantity: quantity || 1,
            price,
            discount: discount || 0
        });

        await newCartItem.save();
        res.status(201).json({ message: "Added to cart successfully.", item: newCartItem });
    } catch (error) {
        res.status(500).json({ message: "Failed to append item to cart.", error: error.message });
    }
};

// UPDATE QUANTITY OF CART ITEM
export const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        if (quantity < 1) {
            return res.status(400).json({ message: "Quantity must be 1 or greater." });
        }

        const updatedItem = await Cart.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            { $set: { quantity } },
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: "Cart item not found or unauthorized." });
        }

        res.status(200).json({ message: "Cart item quantity adjusted.", item: updatedItem });
    } catch (error) {
        res.status(500).json({ message: "Failed to update item quantity.", error: error.message });
    }
};

// REMOVE SINGLE ITEM FROM CART
export const removeCartItem = async (req, res) => {
    try {
        const deletedItem = await Cart.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!deletedItem) {
            return res.status(404).json({ message: "Item not found in your cart collection." });
        }

        res.status(200).json({ message: "Item purged from cart successfully." });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete item from cart.", error: error.message });
    }
};

// CLEAR ENTIRE CART
export const clearCart = async (req, res) => {
    try {
        await Cart.deleteMany({ userId: req.user.userId });
        res.status(200).json({ message: "Your shopping cart has been completely emptied." });
    } catch (error) {
        res.status(500).json({ message: "Failed to empty cart collection.", error: error.message });
    }
};