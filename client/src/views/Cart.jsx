import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/apiService";

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderMessage, setOrderMessage] = useState("");
    
    // Address Form State matching checkout inputs
    const [shippingForm, setShippingForm] = useState({
        name: "", email: "", mobile: "", address: "", pincode: "", paymentMethod: "COD"
    });

    const fetchCart = async () => {
        try {
            const response = await API.get("/cart");
            setCartItems(response.data);
        } catch (error) {
            console.error("Error pulling cart portfolio data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleQuantityChange = async (itemId, currentQty, increment) => {
        const newQty = currentQty + increment;
        if (newQty < 1) return;

        try {
            await API.put(`/cart/update/${itemId}`, { quantity: newQty });
            fetchCart();
        } catch (error) {
            console.error("Failed adjusting quantity attributes:", error);
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            await API.delete(`/cart/remove/${itemId}`);
            fetchCart();
        } catch (error) {
            console.error("Failed removing target line item:", error);
        }
    };

    const handleInputChange = (e) => {
        setShippingForm({ ...shippingForm, [e.target.name]: e.target.value });
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        setOrderMessage("");

        if (cartItems.length === 0) return;

        try {
            // Process the first item in the bag to map exactly to the current single-item order schema layout
            const primaryItem = cartItems[0];
            
            await API.post("/orders/checkout", {
                ...shippingForm,
                title: primaryItem.title,
                description: primaryItem.description,
                mainImg: primaryItem.mainImg,
                size: primaryItem.size,
                quantity: primaryItem.quantity,
                price: primaryItem.price,
                discount: primaryItem.discount
            });

            // Wipe out remaining cart holdings since checkout completed
            await API.delete("/cart/clear");
            
            setOrderMessage("Order placed successfully! Redirecting to tracking... 🎉");
            setCartItems([]);
            
            setTimeout(() => {
                navigate("/orders");
            }, 2500);

        } catch (error) {
            setOrderMessage(error.response?.data?.message || "Checkout failed. Please verify credentials.");
        }
    };

    // Calculation computations mapping pricing aggregates
    const totalMRP = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const totalDiscount = cartItems.reduce((acc, item) => acc + Math.round((item.price * (item.discount / 100)) * item.quantity), 0);
    const totalAmount = totalMRP - totalDiscount;

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                <p style={{ color: "var(--text-muted)", fontSize: "16px", fontWeight: "600" }}>Loading Bag...</p>
            </div>
        );
    }

    if (cartItems.length === 0 && !orderMessage) {
        return (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <span style={{ fontSize: "48px" }}>🛍️</span>
                <h2 style={{ fontSize: "20px", fontWeight: "700", marginTop: "16px", color: "var(--text-dark)" }}>Your bag is empty!</h2>
                <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "6px", marginBottom: "24px" }}>Add items to it to kickstart your collection.</p>
                <button onClick={() => navigate("/catalog")} className="btn-primary" style={{ padding: "12px 30px", fontSize: "13px" }}>Shop Collection</button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "1100px", margin: "40px auto", padding: "0 20px" }}>
            {orderMessage && (
                <div style={{ backgroundColor: "#e6f4ea", color: "#137333", padding: "16px", borderRadius: "4px", marginBottom: "24px", fontWeight: "600", textAlign: "center" }}>
                    {orderMessage}
                </div>
            )}

            <div style={{ display: "flex", gap: "40px", flexWrap: "wrap", alignItems: "flex-start" }}>
                
                {/* LEFT SIDE: Items & Shipping details forms */}
                <div style={{ flex: "1 1 600px", display: "flex", flexDirection: "column", gap: "30px" }}>
                    
                    {/* Items List */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: "700",  paddingBottom: "10px", textTransform: "uppercase" }}>
                            Items in Bag ({cartItems.length})
                        </h3>
                        {cartItems.map((item) => (
                            <div key={item._id} style={{ display: "flex", gap: "16px", border: "1px solid var(--border-color)", padding: "16px", position: "relative",backgroundColor: "var(--bg-light)" }}>
                                <div style={{ width: "90px", height: "120px", overflow: "hidden", backgroundColor: "var(--bg-light)" }}>
                                    <img src={item.mainImg} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>
                                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                                    <h4 style={{ fontSize: "14px", fontWeight: "700" }}>{item.title}</h4>
                                    <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Size: <strong>{item.size}</strong></p>
                                    
                                    {/* Increment Controllers */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "6px" }}>
                                        <button onClick={() => handleQuantityChange(item._id, item.quantity, -1)} style={{ border: "1px solid var(--border-color)", background: "none", width: "24px", height: "24px", cursor: "pointer", fontWeight: "700" }}>-</button>
                                        <span style={{ fontSize: "14px", fontWeight: "600" }}>{item.quantity}</span>
                                        <button onClick={() => handleQuantityChange(item._id, item.quantity, 1)} style={{ border: "1px solid var(--border-color)", background: "none", width: "24px", height: "24px", cursor: "pointer", fontWeight: "700" }}>+</button>
                                    </div>

                                    <div style={{ marginTop: "10px", fontSize: "14px", fontWeight: "700" }}>
                                        ${Math.round(item.price * (1 - item.discount / 100)) * item.quantity}
                                    </div>
                                </div>

                                <button 
                                    onClick={() => handleRemoveItem(item._id)}
                                    style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "var(--text-muted)" }}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Delivery Form inputs */}
                    <form onSubmit={handleCheckout} style={{ display: "flex", flexDirection: "column", gap: "16px", border: "1px solid var(--border-color)", padding: "24px" ,backgroundColor: "var(--bg-light)"}}>
                        <h3 style={{ fontSize: "16px", fontWeight: "700", textTransform: "uppercase", marginBottom: "4px" }}>Delivery Address Details</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                            <input type="text" name="name" placeholder="Contact Name" className="input-field" value={shippingForm.name} onChange={handleInputChange} required />
                            <input type="email" name="email" placeholder="Fulfillment Email Address" className="input-field" value={shippingForm.email} onChange={handleInputChange} required />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                            <input type="text" name="mobile" placeholder="Mobile Number" className="input-field" value={shippingForm.mobile} onChange={handleInputChange} required />
                            <input type="text" name="pincode" placeholder="Pincode / Postal Zip" className="input-field" value={shippingForm.pincode} onChange={handleInputChange} required />
                        </div>
                        <input type="text" name="address" placeholder="Complete Street Address Destination" className="input-field" value={shippingForm.address} onChange={handleInputChange} required />
                        
                        <div>
                            <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-dark)", display: "block", marginBottom: "6px" }}>PAYMENT METHOD</label>
                            <select name="paymentMethod" className="input-field" value={shippingForm.paymentMethod} onChange={handleInputChange}>
                                <option value="COD">Cash On Delivery (COD)</option>
                                <option value="UPI">UPI Transfer Gateway</option>
                                <option value="CARD">Credit / Debit Card</option>
                            </select>
                        </div>
                    </form>
                </div>

                {/* RIGHT SIDE: Dynamic Pricing Ledger Breakdown */}
                <div style={{ flex: "1 1 350px", border: "1px solid var(--border-color)", padding: "24px", position: "sticky", top: "120px" ,backgroundColor: "var(--bg-light)"}}>
                    <h3 style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-muted)", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "16px" }}>
                        Price Details ({cartItems.length} Items)
                    </h3>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px", borderBottom: "1px solid var(--border-color)", paddingBottom: "16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>Total MRP</span><span>${totalMRP}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>Discount on MRP</span><span style={{ color: "#257a3c" }}>-${totalDiscount}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>Convenience Fee</span><span style={{ color: "#257a3c" }}>FREE</span>
                        </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: "700", marginTop: "16px", marginBottom: "24px" }}>
                        <span>Total Amount</span><span>${totalAmount}</span>
                    </div>

                    <button onClick={handleCheckout} className="btn-primary" style={{ width: "100%", padding: "14px", fontSize: "14px" }}>
                        PLACE ORDER
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Cart;