import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: { type: String },
    description: { type: String },
    mainimg: { type: String },
    carousel: { type: Array },
    sizes: { type: Array },
    category: { type: String },
    gender: { type: String },
    price: { type: Number },
    discount: { type: Number }
});

export const Product = mongoose.model('products', productSchema);