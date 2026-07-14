import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String },
    name: { type: String },
    email: { type: String },
    mobile: { type: String },
    address: { type: String },
    pincode: { type: String },
    title: { type: String },
    description: { type: String },
    mainImg: { type: String },
    size: { type: String },
    quantity: { type: Number },
    price: { type: Number },
    discount: { type: Number },
    paymentMethod: { type: String },
    orderDate: { type: String },
    deliveryDate: { type: String },
    orderStatus: { type: String, default: "order placed" }
});

export const Orders = mongoose.model('orders', orderSchema);
