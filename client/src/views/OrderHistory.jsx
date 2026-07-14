import React, { useEffect, useState } from "react";
import API from "../api/apiService";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                const response = await API.get("/orders/my-orders");
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching personal order track ledger:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderHistory();
    }, []);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "order placed": return "#ff905a";
            case "shipped": return "#1478c1";
            case "delivered": return "#257a3c";
            case "cancelled": return "var(--primary-pink)";
            default: return "var(--text-dark)";
        }
    };

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                <p style={{ color: "var(--text-muted)", fontSize: "16px", fontWeight: "600" }}>Loading Orders...</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "850px", margin: "40px auto", padding: "0 20px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "24px",  paddingBottom: "12px" }}>
                Your Purchases Ledger ({orders.length})
            </h2>

            {orders.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {orders.map((order) => (
                        <div key={order._id} style={{ border: "1px solid var(--border-color)", padding: "20px", display: "flex", flexDirection: "column", gap: "16px",backgroundColor: "var(--bg-light)" }}>
                            
                            {/* Panel Header */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", borderBottom: "1px dashed var(--border-color)", paddingBottom: "12px", fontSize: "13px" }}>
                                <div>
                                    <span style={{ color: "var(--text-muted)" }}>Order ID:</span> <strong style={{ color: "var(--text-dark)" }}>#{order._id}</strong>
                                </div>
                                <div>
                                    <span style={{ color: "var(--text-muted)" }}>Placed On:</span> <strong>{order.orderDate}</strong>
                                </div>
                                <div style={{ 
                                    backgroundColor: getStatusColor(order.orderStatus) + "12", 
                                    color: getStatusColor(order.orderStatus),
                                    padding: "6px 14px", fontWeight: "700", textTransform: "uppercase", fontSize: "11px", borderRadius: "2px"
                                }}>
                                    {order.orderStatus}
                                </div>
                            </div>

                            {/* Panel Body Content mapping orderSchema structural parameters */}
                            <div style={{ display: "flex", gap: "16px" }}>
                                <div style={{ width: "70px", height: "95px", overflow: "hidden", backgroundColor: "var(--bg-light)" }}>
                                    <img src={order.mainImg} alt={order.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>
                                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                                    <h4 style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-dark)" }}>{order.title}</h4>
                                    <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Size: <strong>{order.size}</strong> | Qty: <strong>{order.quantity}</strong></p>
                                    <p style={{ fontSize: "14px", fontWeight: "700", marginTop: "4px" }}>
                                        Total Paid: ${Math.round(order.price * (1 - order.discount / 100)) * order.quantity}
                                    </p>
                                </div>
                            </div>

                            {/* Logistics Status Dates Footer */}
                            {order.deliveryDate && (
                                <div style={{ fontSize: "13px", color: "var(--text-muted)", backgroundColor: "var(--bg-light)", padding: "10px 14px" }}>
                                    🚚 Delivered Carrier Update: Completed on <strong>{order.deliveryDate}</strong>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;