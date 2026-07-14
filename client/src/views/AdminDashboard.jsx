import React, { useEffect, useState } from "react";
import API from "../api/apiService";

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [config, setConfig] = useState({ banner: "", categories: [] });
    const [newCategory, setNewCategory] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const fetchAdminData = async () => {
        try {
            setLoading(true);
            const orderRes = await API.get("/orders/all-orders");
            const configRes = await API.get("/admin/config");
            
            setOrders(orderRes.data);
            if (configRes.data) {
                setConfig({
                    banner: configRes.data.banner || "",
                    categories: configRes.data.categories || []
                });
            }
        } catch (error) {
            console.error("Error gathering secure admin metadata sets:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    // Configuration Adjustments
    const handleConfigSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        try {
            await API.put("/admin/config", config);
            setMessage("Storefront configuration parameters updated successfully! ✨");
        } catch (error) {
            setMessage("Failed adjusting global display configuration.");
        }
    };

    const addCategoryTag = () => {
        if (!newCategory.trim() || config.categories.includes(newCategory.trim())) return;
        setConfig({ ...config, categories: [...config.categories, newCategory.trim()] });
        setNewCategory("");
    };

    const removeCategoryTag = (indexToRemove) => {
        const filtered = config.categories.filter((_, idx) => idx !== indexToRemove);
        setConfig({ ...config, categories: filtered });
    };

    // Logistics Order State Updates
    const handleStatusTransition = async (orderId, targetStatus) => {
        try {
            const payload = { orderStatus: targetStatus };
            // Auto-fill delivery date tag if status transitions to completed distribution
            if (targetStatus === "delivered") {
                payload.deliveryDate = new Date().toISOString().split('T')[0];
            }

            await API.put(`/orders/status/${orderId}`, payload);
            fetchAdminData(); // Refresh list layout matches updated values
        } catch (error) {
            console.error("Fulfillment operational transition failed:", error);
        }
    };

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                <p style={{ color: "var(--text-muted)", fontSize: "16px", fontWeight: "600" }}>Loading Administration Core...</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px", display: "flex", flexDirection: "column", gap: "50px",background:"hsl(8, 96%, 79%)" }}>

            {message && (
                <div style={{ backgroundColor: "#e6f4ea", color: "#137333", padding: "14px", fontWeight: "600", fontSize: "14px", textAlign: "center" }}>
                    {message}
                </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px", alignItems: "start" }}>

                {/* RIGHT HEADER: Orders Panel Title */}
                <div style={{ gridColumn: "2 / 3" }}>
                    <h2 style={{ fontSize: "16px", fontWeight: "800", textTransform: "uppercase"}}>
                        Active Client Orders Ledger ({orders.length})
                    </h2>
                </div>

                {/* LEFT BLOCK: Storefront Layout Manager Settings */}
                <div style={{ gridRow: "2", border: "1px solid var(--border-color)", padding: "24px", background: "var(--white)",marginRight:"15px" }}>
                    <h2 style={{ fontSize: "16px", fontWeight: "800", textTransform: "uppercase", marginBottom: "20px", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
                        Storefront Customizer
                    </h2>
                    
                    <form onSubmit={handleConfigSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div>
                            <label style={{ fontSize: "13px", fontWeight: "700", display: "block", marginBottom: "6px" }}>HERO PROMO BANNER IMAGE URL</label>
                            <input 
                                type="text" 
                                className="input-field" 
                                placeholder="Paste asset image URL link address"
                                value={config.banner}
                                onChange={(e) => setConfig({ ...config, banner: e.target.value })}
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: "13px", fontWeight: "700", display: "block", marginBottom: "6px" }}>NAVIGATION SECTOR CATEGORIES</label>
                            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                                <input 
                                    type="text" 
                                    className="input-field" 
                                    placeholder="Add Label (e.g., Ethnic Wear)"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                />
                                <button type="button" onClick={addCategoryTag} className="btn-primary" style={{ padding: "0 20px", textTransform: "none", fontSize: "13px" }}>Add</button>
                            </div>

                            {/* Tags render lists */}
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                {config.categories.map((cat, index) => (
                                    <span key={index} style={{ backgroundColor: "var(--bg-light)", border: "1px solid var(--border-color)", padding: "6px 12px", fontSize: "13px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                                        {cat}
                                        <button type="button" onClick={() => removeCategoryTag(index)} style={{ background: "none", border: "none", color: "var(--primary-pink)", fontWeight: "800", cursor: "pointer" }}>✕</button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" style={{ padding: "12px", fontSize: "13px", marginTop: "10px" }}>
                            SAVE ADJUSTMENTS
                        </button>
                    </form>
                </div>

                {/* RIGHT BLOCK: Global Transactions Queues */}
                <div style={{ gridRow: "2", display: "flex", flexDirection: "column", gap: "20px" }}>
                    {orders.length === 0 ? (
                        <p style={{ color: "var(--text-muted)", fontSize: "14px", padding: "20px 0" }}>No global system orders inside processing pipelines currently.</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            {orders.map((order) => (
                                <div key={order._id} style={{ border: "1px solid var(--border-color)", padding: "20px", backgroundColor: "var(--white)", display: "flex", flexDirection: "column", gap: "12px" }}>
                                    
                                    {/* Order Row Head meta mappings */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "8px" }}>
                                        <span style={{ fontSize: "14px" }}>ID: <strong>#{order._id}</strong></span>
                                        <span style={{ 
                                            fontSize: "12px", fontWeight: "700", textTransform: "uppercase", 
                                            color: order.orderStatus === "delivered" ? "#257a3c" : "#ff905a",
                                            backgroundColor: "var(--bg-light)", padding: "4px 8px"
                                        }}>{order.orderStatus}</span>
                                    </div>

                                    {/* Delivery and Customer metadata summary */}
                                    <div style={{ fontSize: "13px", color: "var(--text-dark)", lineHeight: "1.5", padding: "10px", backgroundColor: "var(--bg-light)" }}>
                                        <div>👤 Client: <strong>{order.name}</strong> ({order.email})</div>
                                        <div>📞 Mobile: {order.mobile} | 📍 Dest: {order.address}, PIN {order.pincode}</div>
                                        <div>📦 Item Details: <strong>{order.title}</strong> [Size {order.size}] x{order.quantity}</div>
                                    </div>

                                    {/* Trigger Status Operations Options buttons */}
                                    {order.orderStatus !== "delivered" && order.orderStatus !== "cancelled" && (
                                        <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                                            {order.orderStatus === "order placed" && (
                                                <button onClick={() => handleStatusTransition(order._id, "shipped")} className="btn-primary" style={{ padding: "6px 12px", fontSize: "12px", textTransform: "none", backgroundColor: "#1478c1" }}>
                                                    🚚 Dispatch Cargo (Ship)
                                                </button>
                                            )}
                                            {order.orderStatus === "shipped" && (
                                                <button onClick={() => handleStatusTransition(order._id, "delivered")} className="btn-primary" style={{ padding: "6px 12px", fontSize: "12px", textTransform: "none", backgroundColor: "#257a3c" }}>
                                                    ✅ Log Final Delivery
                                                </button>
                                            )}
                                            <button onClick={() => handleStatusTransition(order._id, "cancelled")} style={{ padding: "6px 12px", fontSize: "12px", background: "none", border: "1px solid var(--primary-pink)", color: "var(--primary-pink)", fontWeight: "700", cursor: "pointer" }}>
                                                Cancel Order
                                            </button>
                                        </div>
                                    )}

                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;