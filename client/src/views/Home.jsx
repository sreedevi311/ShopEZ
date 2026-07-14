import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/apiService";

const Home = () => {
    const navigate = useNavigate();
    const [storeConfig, setStoreConfig] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStoreConfig = async () => {
            try {
                const response = await API.get("/admin/config");
                setStoreConfig(response.data);
            } catch (error) {
                console.error("Error loading storefront configuration:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStoreConfig();
    }, []);

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                <p style={{ color: "var(--text-muted)", fontSize: "16px", fontWeight: "600" }}>Loading Storefront...</p>
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: "60px",background: "hsl(8, 96%, 79%)" }}>
            {/* Dynamic Hero Promotion Banner */}
            {storeConfig?.banner && (
                <div 
                    onClick={() => navigate("/catalog")}
                    style={{
  width: "calc(100% - 40px)",
  height: "80vh",
  margin: "20px",
  backgroundImage: `url(${storeConfig.banner})`,
  backgroundSize: "cover",
  backgroundPosition: "center 25%",
  backgroundRepeat: "no-repeat",
  cursor: "pointer",
  position: "relative",
  transition: "opacity 0.3s ease",
}}
                >
                    <div style={{
  position: "absolute",
  top: "25%",
  left: "15%",
  transform: "translate(-50%, -50%) rotate(-22deg)",
  backgroundColor: "rgba(255,255,255,0.95)",
  padding: "25px 40px",
  boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
  borderRadius: "4px",
  zIndex: 10
}}>
                        <h1 style={{ fontSize: "24px", fontWeight: "800", color: "var(--text-dark)", letterSpacing: "1px", marginBottom: "4px" }}>
                            FLAT 50% OFF
                        </h1>
                        <p style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "600", letterSpacing: "0.5px" }}>
                            + FREE SHIPPING ON ALL FIRST ORDERS
                        </p>
                    </div>
                </div>
            )}

            {/* Core Category Navigation Section */}
            <div style={{ maxWidth: "1200px", margin: "60px auto 0 auto", padding: "0 20px" }}>
                <h2 style={{ 
                    fontSize: "22px", fontWeight: "800", color: "var(--text-dark)", 
                    letterSpacing: "1px", textTransform: "uppercase", marginBottom: "30px",
                    textAlign: "center"
                }}>
                    Shop By Category
                </h2>

                <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", 
                    gap: "24px" 
                }}>
                    {storeConfig?.categories?.map((cat, index) => (
                        <div 
                            key={index}
                            className="card"
                            onClick={() => navigate(`/catalog?category=${cat}`)}
                            style={{
                                padding: "30px 20px",
                                textAlign: "center",
                                cursor: "pointer",
                                border: "1px solid var(--border-color)",
                                backgroundColor: "var(--white)",
                                transition: "all 0.2s ease"
                            }}
                        >
                            <h3 style={{ 
                                fontSize: "15px", fontWeight: "700", color: "var(--text-dark)", 
                                textTransform: "uppercase", letterSpacing: "0.5px"
                            }}>
                                {cat}
                            </h3>
                            <p style={{ 
                                fontSize: "12px", color: "var(--primary-pink)", 
                                fontWeight: "700", marginTop: "8px", letterSpacing: "0.5px" 
                            }}>
                                SHOP NOW
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;