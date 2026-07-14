import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/apiService";
import { AuthContext } from "../context/AuthContext";

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [product, setProduct] = useState(null);
    const [activeImage, setActiveImage] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [loading, setLoading] = useState(true);
    const [actionMessage, setActionMessage] = useState("");
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await API.get(`/products/${id}`);
                setProduct(response.data);
                setActiveImage(response.data.mainimg);
            } catch (error) {
                console.error("Error reading single product schema data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductDetails();
    }, [id]);

    const handleAddToBag = async () => {
        setActionMessage("");
        setIsError(false);

        // Security Validation Guard
        if (!user) {
            setActionMessage("Please login to staging items in your checkout bag.");
            setIsError(true);
            setTimeout(() => navigate("/login"), 2000);
            return;
        }

        // Configuration Validation Guard
        if (!selectedSize) {
            setActionMessage("Please select a size before adding to bag.");
            setIsError(true);
            return;
        }

        try {
            await API.post("/cart/add", {
                title: product.title,
                description: product.description,
                mainImg: product.mainimg,
                size: selectedSize,
                quantity: 1,
                price: product.price,
                discount: product.discount
            });

            setActionMessage("Added to your shopping bag successfully! 🛍️");
        } catch (error) {
            setActionMessage(error.response?.data?.message || "Failed adding item to cart portfolio.");
            setIsError(true);
        }
    };

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                <p style={{ color: "var(--text-muted)", fontSize: "16px", fontWeight: "600" }}>Loading Product...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
                <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>Product data could not be parsed.</p>
            </div>
        );
    }

    const finalPrice = Math.round(product.price * (1 - product.discount / 100));

    return (
        <div style={{ maxWidth: "1100px", margin: "40px auto", padding: "0 20px" }}>
            <div style={{ display: "flex", gap: "40px", flexWrap: "wrap", alignItems: "flex-start" }}>
                
                {/* LEFT COLUMN: Gallery Panel */}
                <div style={{ flex: "1 1 500px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    
                    {/* Thumbnail Track */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {product.carousel?.map((imgUrl, index) => (
                            <div 
                                key={index}
                                onClick={() => setActiveImage(imgUrl)}
                                style={{
                                    width: "64px", 
                                    height: "80px", 
                                    overflow: "hidden", 
                                    cursor: "pointer",
                                    borderRadius: "4px", // Sharper aesthetic border curves
                                    border: activeImage === imgUrl ? "2px solid var(--primary-pink)" : "1px solid var(--border-color)",
                                    boxShadow: activeImage === imgUrl ? "0 4px 12px rgba(255,63,108,0.15)" : "none",
                                    transition: "all 0.2s ease"
                                }}
                            >
                                <img src={imgUrl} alt="thumbnail" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                        ))}
                    </div>

                    {/* Stage Hero Image View */}
                    <div style={{ flex: 1, height: "540px", backgroundColor: "var(--bg-light)", border: "1px solid var(--border-color)", borderRadius: "4px", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
                        <img src={activeImage} alt={product.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                </div>

                {/* RIGHT COLUMN: Buying Description Panel */}
                <div style={{ flex: "1 1 450px", display: "flex", flexDirection: "column", gap: "24px", backgroundColor: "var(--white)", border: "1px solid var(--border-color)", borderRadius: "4px", padding: "30px", boxShadow: "var(--shadow-sm)" }}>
                    
                    {/* Title & Description Block */}
                    <div>
                        <h1 style={{ fontSize: "24px", fontWeight: "800", color: "var(--text-dark)", marginBottom: "6px", letterSpacing: "0.5px" }}>
                            {product.title}
                        </h1>
                        <p style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: "1.6" }}>
                            {product.description}
                        </p>
                    </div>

                    {/* Price Block Layout */}
                    <div style={{ display: "flex", alignItems: "baseline", gap: "12px", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)", padding: "16px 0" }}>
                        <span style={{ fontSize: "24px", fontWeight: "700", color: "var(--text-dark)" }}>${finalPrice}</span>
                        {product.discount > 0 && (
                            <>
                                <span style={{ textDecoration: "line-through", color: "var(--text-muted)", fontSize: "15px" }}>${product.price}</span>
                                <span style={{ color: "#ff905a", fontWeight: "700", fontSize: "13px", backgroundColor: "#ffe9ef", padding: "4px 8px", borderRadius: "2px" }}>
                                    {product.discount}% OFF
                                </span>
                            </>
                        )}
                    </div>

                    {/* Sizes Selection Group */}
                    <div>
                        <h3 style={{ fontSize: "13px", fontWeight: "800", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-dark)" }}>
                            Select Size
                        </h3>
                        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                            {product.sizes?.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    style={{
                                        width: "45px", 
                                        height: "45px", 
                                        borderRadius: "50%", 
                                        border: selectedSize === size ? "1px solid var(--text-dark)" : "1px solid var(--border-color)",
                                        backgroundColor: selectedSize === size ? "var(--text-dark)" : "var(--white)",
                                        color: selectedSize === size ? "var(--white)" : "var(--text-dark)",
                                        fontWeight: "700", 
                                        cursor: "pointer", 
                                        fontSize: "13px", 
                                        display: "flex", 
                                        alignItems: "center", 
                                        justifyContent: "center",
                                        boxShadow: selectedSize === size ? "0 4px 10px rgba(0,0,0,0.15)" : "none",
                                        transition: "all 0.2s ease"
                                    }}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Operational Actions Section */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "6px" }}>
                        <button 
                            onClick={handleAddToBag} 
                            className="btn-primary" 
                            style={{ 
                                padding: "16px", 
                                fontSize: "14px", 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center", 
                                gap: "10px",
                                borderRadius: "4px",
                                boxShadow: "none"
                            }}
                        >
                            <span>🛍️</span> ADD TO BAG
                        </button>

                        {actionMessage && (
                            <div style={{ 
                                padding: "12px 16px", 
                                borderRadius: "4px", 
                                fontSize: "13px", 
                                fontWeight: "600", 
                                textAlign: "center",
                                backgroundColor: isError ? "#fff1f2" : "#f0fdf4",
                                color: isError ? "#e11d48" : "#15803d",
                                border: isError ? "1px solid #fecdd3" : "1px solid #bbf7d0",
                            }}>
                                {actionMessage}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductDetail;