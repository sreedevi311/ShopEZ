import { Orders } from "../models/orderSchema.js";

// PLACE A NEW ORDER (Checkout)
export const checkoutOrder = async (req, res) => {
    try {
        const { 
            name, email, mobile, address, pincode, 
            title, description, mainImg, size, 
            quantity, price, discount, paymentMethod 
        } = req.body;

        if (!name || !mobile || !address || !pincode || !title || !price || !paymentMethod) {
            return res.status(400).json({ message: "Missing vital fulfillment checkout data." });
        }

        const newOrder = new Orders({
            userId: req.user.userId,
            name,
            email,
            mobile,
            address,
            pincode,
            title,
            description,
            mainImg,
            size,
            quantity: quantity || 1,
            price,
            discount: discount || 0,
            paymentMethod,
            orderDate: new Date().toISOString().split('T')[0], // Stamps current date (YYYY-MM-DD)
            deliveryDate: "", 
            orderStatus: "order placed" 
        });

        await newOrder.save();
        res.status(201).json({ message: "Order processed successfully!", order: newOrder });
    } catch (error) {
        res.status(500).json({ message: "Checkout operational fault.", error: error.message });
    }
};

// GET LOGGED-IN USER'S ORDER HISTORY
export const getMyOrders = async (req, res) => {
    try {
        const history = await Orders.find({ userId: req.user.userId });
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: "Error loading purchase tracking history.", error: error.message });
    }
};

// GET SYSTEM-WIDE ORDERS QUEUE (Admin Only)
export const getAllOrders = async (req, res) => {
    try {
        const dashboardOrders = await Orders.find({});
        res.status(200).json(dashboardOrders);
    } catch (error) {
        res.status(500).json({ message: "Error compiling admin order ledger.", error: error.message });
    }
};

// UPDATE ORDER STATUS & DELIVERY DATE (Admin Only)
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus, deliveryDate } = req.body;

        if (!orderStatus) {
            return res.status(400).json({ message: "Target status updates required." });
        }

        let updatePayload = { orderStatus };
        if (deliveryDate) updatePayload.deliveryDate = deliveryDate;

        const modifiedOrder = await Orders.findByIdAndUpdate(
            req.params.id,
            { $set: updatePayload },
            { new: true }
        );

        if (!modifiedOrder) {
            return res.status(404).json({ message: "Order document record matching ID not located." });
        }

        res.status(200).json({ message: "Fulfillment status records adjusted.", order: modifiedOrder });
    } catch (error) {
        res.status(500).json({ message: "Failed updating logistics attributes.", error: error.message });
    }
};