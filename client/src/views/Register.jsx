import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/apiService";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            setLoading(true);
            await API.post("/auth/register", formData);
            setSuccess("Account built flawlessly! Routing to security gates...");
            
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Try changing attributes.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 80px)", backgroundColor: "var(--bg-light)" }}>
            <div className="card" style={{ width: "100%", maxWidth: "420px", padding: "40px", borderRadius: "0px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "24px", color: "var(--text-dark)", textAlign: "center", letterSpacing: "0.5px" }}>
                    Sign Up <span style={{ color: "var(--text-muted)", fontWeight: "400", fontSize: "16px" }}>to Join ShopEz</span>
                </h2>

                {error && <p style={{ color: "var(--primary-pink)", fontSize: "13px", marginBottom: "16px", fontWeight: "600" }}>{error}</p>}
                {success && <p style={{ color: "green", fontSize: "13px", marginBottom: "16px", fontWeight: "600" }}>{success}</p>}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div>
                        <input 
                            type="text" 
                            name="username"
                            placeholder="Choose Username" 
                            className="input-field" 
                            value={formData.username}
                            onChange={handleChange}
                            required 
                        />
                    </div>
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
                            placeholder="Create Password" 
                            className="input-field" 
                            value={formData.password}
                            onChange={handleChange}
                            required 
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{ padding: "14px", fontSize: "14px", width: "100%" }} disabled={loading}>
                        {loading ? "Registering..." : "CREATE ACCOUNT"}
                    </button>
                </form>

                <p style={{ marginTop: "24px", textAlign: "center", fontSize: "13px", color: "var(--text-muted)" }}>
                    Already have an account? <Link to="/login" style={{ color: "var(--primary-pink)", fontWeight: "700", textDecoration: "none" }}>Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;