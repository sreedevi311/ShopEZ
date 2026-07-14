import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    banner: { type: String },
    categories: { type: Array }
});

export const Admin = mongoose.model('admin', adminSchema);