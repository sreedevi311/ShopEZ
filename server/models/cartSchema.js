import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: { type: String },
    title: { type: String },
    description: { type: String },
    mainImg: { type: String },
    size: { type: String },
    quantity: { type: Number },
    price: { type: Number },
    discount: { type: Number }
});

export const Cart = mongoose.model('cart', cartSchema);