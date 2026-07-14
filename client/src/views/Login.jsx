import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/apiService";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(false);

        try {
            setLoading(true);
            const response = await API.post("/auth/login", formData);
            
            // Extract the user record and JWT token from our controller response mapping
            const { user, token } = response.data;
            login(user, token);

            // Dynamically redirect user based on their account access tier
            if (user.usertype === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 80px)", backgroundColor: "var(--bg-light)" }}>
            <div className="card" style={{ width: "100%", maxWidth: "420px", padding: "40px", borderRadius: "0px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "24px", color: "var(--text-dark)", textAlign: "center", letterSpacing: "0.5px" }}>
                    Login <span style={{ color: "var(--text-muted)", fontWeight: "400", fontSize: "16px" }}>or</span> Signup
                </h2>
                
                {error && <p style={{ color: "var(--primary-pink)", fontSize: "13px", marginBottom: "16px", fontWeight: "600" }}>{error}</p>}
                
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div>
                        <input 
                            type="email" 
                            name="email"
                            placeholder="Enter Email Address" 
                            className="input-field" 
                            value={formData.email}
                            onChange={handleChange}
                            required 
                        />
                    </div>
                    <div>
                        <input 
                            type="password" 
                            name="password"
                            placeholder="Enter Password" 
                            className="input-field" 
                            value={formData.password}
                            onChange={handleChange}
                            required 
                        />
                    </div>
                    
                    <button type="submit" className="btn-primary" style={{ padding: "14px", fontSize: "14px", width: "100%" }} disabled={loading}>
                        {loading ? "Verifying..." : "CONTINUE"}
                    </button>
                </form>

                <p style={{ marginTop: "24px", textAlign: "center", fontSize: "13px", color: "var(--text-muted)" }}>
                    New to ShopEz? <Link to="/register" style={{ color: "var(--primary-pink)", fontWeight: "700", textDecoration: "none" }}>Create an account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;