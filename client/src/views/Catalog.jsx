import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/apiService";

const Catalog = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Extract query values out of URL parameters dynamically
    const queryParams = new URLSearchParams(location.search);
    const categoryFilter = queryParams.get("category");
    const genderFilter = queryParams.get("gender");

    // 1. Extract the search param at the top where your query strings are parsed:
    const searchFilter = queryParams.get("search");

    // 2. Add searchFilter to the dependency array and parameters bundle inside the useEffect hook:
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await API.get("/products", {
                    // Pass searchFilter to the backend query pipeline seamlessly
                    params: { category: categoryFilter, gender: genderFilter, search: searchFilter }
                });
                setProducts(response.data);
            } catch (error) {
                console.error("Error loading clothing catalog items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryFilter, genderFilter, searchFilter]); // <-- Added searchFilter to the dependency array!

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // Attach filtering params to backend controller endpoint
                const response = await API.get("/products", {
                    params: { category: categoryFilter, gender: genderFilter }
                });
                setProducts(response.data);
            } catch (error) {
                console.error("Error loading clothing catalog items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryFilter, genderFilter]);

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                <p style={{ color: "var(--text-muted)", fontSize: "16px", fontWeight: "600" }}>Loading Catalog...</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px" }}>
            {/* Context Heading Title */}
            <div style={{  paddingBottom: "16px", marginBottom: "30px" }}>
                <h2 style={{ fontSize: "22px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" }}>
                    {genderFilter ? `${genderFilter}'s ` : ""}
                    {categoryFilter ? `${categoryFilter} ` : "All Collections"}
                    <span style={{ fontSize: "16px", color: "black", fontWeight: "500", marginLeft: "10px" }}>
                        ({products.length} items found)
                    </span>
                </h2>
            </div>

            {/* Catalog Grid View */}
            {products.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                    <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>No items matching filters right now.</p>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "30px" }}>
                    {products.map((item) => {
                        // Math calculation for discount price tag display
                        const discountedPrice = Math.round(item.price * (1 - item.discount / 100));

                        return (
                            <div 
                                key={item._id} 
                                className="card"
                                onClick={() => navigate(`/product/${item._id}`)}
                                style={{ cursor: "pointer", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column" }}
                            >
                                {/* Core Image Canvas Layout */}
                                <div style={{ width: "100%", height: "320px", overflow: "hidden", backgroundColor: "var(--bg-light)" }}>
                                    <img 
                                        src={item.mainimg} 
                                        alt={item.title} 
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                </div>

                                {/* Summary Description Meta Details */}
                                <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-dark)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {item.title}
                                    </h3>
                                    <p style={{ fontSize: "12px", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {item.description}
                                    </p>
                                    
                                    {/* Price Tiers Grouping */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px", fontSize: "14px" }}>
                                        <span style={{ fontWeight: "700", color: "var(--text-dark)" }}>${discountedPrice}</span>
                                        {item.discount > 0 && (
                                            <>
                                                <span style={{ textDecoration: "line-through", color: "var(--text-muted)", fontSize: "12px" }}>${item.price}</span>
                                                <span style={{ color: "#ff905a", fontWeight: "700", fontSize: "12px" }}>({item.discount}% OFF)</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Catalog;