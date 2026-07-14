import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api/apiService";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation(); // Used to evaluate and highlight active routes
    
    const dropdownRef = useRef(null);
    const profileRef = useRef(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [liveSuggestions, setLiveSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleLogout = () => {
        logout();
        setShowProfileMenu(false);
        navigate("/login");
    };

    // Helper function to check if a navigation route path is currently active
    const isActiveTab = (path) => location.pathname + location.search === path;

    // Live Search Pipeline Handler
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.trim().length > 1) {
                try {
                    const response = await API.get("/products", {
                        params: { search: searchQuery.trim() }
                    });
                    setLiveSuggestions(response.data.slice(0, 5));
                    setShowDropdown(true);
                } catch (error) {
                    console.error("Live suggestions failed:", error);
                }
            } else {
                setLiveSuggestions([]);
                setShowDropdown(false);
            }
        };

        const delayDebounce = setTimeout(() => fetchSuggestions(), 200);
        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    // Close overlays if user clicks anywhere outside the component frame
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const executeSearchRedirect = () => {
        if (searchQuery.trim() !== "") {
            navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
            setShowDropdown(false);
        }
    };

    return (
        <nav style={styles.navbarContainer}>
            {/* 1. LEFT: Premium Brand Logo */}
            <div style={styles.logoWrapper}>
                <Link to="/" style={styles.brandLogo}>
                    Shop<span style={styles.logoAccent}>Ez</span>
                </Link>
            </div>

            {/* 2. MIDDLE-LEFT: Navigation Channels with Active Highlighting Indicators */}
            <div style={styles.navLinksBlock}>
                {user?.usertype === "admin" ? (
                    <div style={styles.linkWrapper}>
                        <Link to="/admin" style={styles.navLink(isActiveTab("/admin"))}>Dashboard</Link>
                        {isActiveTab("/admin") && <div style={styles.activeIndicator} />}
                    </div>
                ) : (
                    <>
                        <div style={styles.linkWrapper}>
                            <Link to="/catalog?gender=Men" style={styles.navLink(isActiveTab("/catalog?gender=Men"))}>Men</Link>
                            {isActiveTab("/catalog?gender=Men") && <div style={styles.activeIndicator} />}
                        </div>
                        <div style={styles.linkWrapper}>
                            <Link to="/catalog?gender=Women" style={styles.navLink(isActiveTab("/catalog?gender=Women"))}>Women</Link>
                            {isActiveTab("/catalog?gender=Women") && <div style={styles.activeIndicator} />}
                        </div>
                        <div style={styles.linkWrapper}>
                            <Link to="/catalog" style={styles.navLink(location.pathname === "/catalog" && !location.search)}>Collection</Link>
                            {(location.pathname === "/catalog" && !location.search) && <div style={styles.activeIndicator} />}
                        </div>
                    </>
                )}
            </div>

            {/* 3. MIDDLE-RIGHT: Clean Interactive Search Console */}
            <div ref={dropdownRef} style={styles.searchConsoleWrapper}>
                <form 
                    onSubmit={(e) => { e.preventDefault(); executeSearchRedirect(); }}
                    style={styles.searchFormCanvas}
                >
                    <input 
                        type="text" 
                        placeholder="Search for products, brands and more..." 
                        style={styles.searchBarInput}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => { if (liveSuggestions.length > 0) setShowDropdown(true); }}
                    />
                    {/* Clickable Search Icon Action Lens button */}
                    <button type="submit" style={styles.searchLensButton} title="Search Now">
                        🔍
                    </button>
                </form>

                {/* Live Suggestions Dropdown Overlay */}
                {showDropdown && liveSuggestions.length > 0 && (
                    <div style={styles.suggestionsCardLayer}>
                        {liveSuggestions.map((item) => (
                            <div 
                                key={item._id}
                                onClick={() => {
                                    setSearchQuery("");
                                    setShowDropdown(false);
                                    navigate(`/product/${item._id}`);
                                }}
                                style={styles.suggestionRow}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-light)"}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--white)"}
                            >
                                <img src={item.mainimg} alt="" style={styles.suggestionThumb} />
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <span style={styles.suggestionTitle}>{item.title}</span>
                                    <span style={styles.suggestionMeta}>in {item.category}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 4. RIGHT: Actions Cluster & Account Management Portal */}
            <div style={styles.rightActionsCluster}>
                {user?.usertype !== "admin" && (
                    <Link to="/cart" style={styles.bagActionLink}>
                        <span style={{ fontSize: "20px" }}>🛒</span>
                    </Link>
                )}

                {/* Secure Dynamic User Dropdown Management System */}
                <div ref={profileRef} style={styles.accountHubWrapper}>
                    {user ? (
                        <>
                            <div 
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                style={styles.profileActivationTrigger}
                            >
                                <span style={styles.userAvatarIcon}>👤</span>
                            </div>

                            {showProfileMenu && (
                                <div style={styles.accountDropdownFlyout}>
                                    <div style={styles.welcomeSalutationHeader}>
                                        <p style={{ fontWeight: "700", color: "var(--text-dark)" }}>Welcome Back,<span style={{ color: "var(--primary-pink)", fontWeight: "600", marginTop: "2px" }}> {user.username}</span></p>
                                    </div>
                                    <div style={styles.dropdownSeparatorLine} />
                                    {user.usertype !== "admin" && (
                                        <Link 
                                            to="/orders" 
                                            onClick={() => setShowProfileMenu(false)}
                                            style={styles.dropdownOptionRow}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-light)"}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                        >
                                            📦 Orders
                                        </Link>
                                    )}
                                    <button 
                                        onClick={handleLogout}
                                        style={styles.dropdownLogoutButton}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fff0f3"}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                    >
                                        🚪 Log Out
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <Link to="/login" className="btn-primary" style={styles.guestLoginButton}>
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

// Advanced CSS-in-JS Themed Styles Object
const styles = {
    navbarContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 50px",
        height: "85px",
        backgroundColor: "var(--white)",
        borderBottom: "1px solid var(--border-color)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 2px 15px rgba(0, 0, 0, 0.03)"
    },
    logoWrapper: {
        display: "flex",
        alignItems: "center"
    },
    brandLogo: {
        fontSize: "26px",
        fontWeight: "800",
        color: "var(--text-dark)",
        textDecoration: "none",
        letterSpacing: "1.5px"
    },
    logoAccent: {
        color: "var(--primary-pink)"
    },
    navLinksBlock: {
        display: "flex",
        gap: "35px",
        marginLeft: "50px",
        height: "100%",
        alignItems: "center"
    },
    linkWrapper: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "85px"
    },
    navLink: (isActive) => ({
        textDecoration: "none",
        fontSize: "14px",
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: "0.8px",
        color: isActive ? "var(--primary-pink)" : "var(--text-dark)",
        transition: "color 0.2s ease"
    }),
    activeIndicator: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "4px",
        backgroundColor: "var(--primary-pink)",
        borderRadius: "4px 4px 0 0"
    },
    searchConsoleWrapper: {
        flex: 1,
        maxWidth: "480px",
        margin: "0 40px",
        position: "relative"
    },
    searchFormCanvas: {
        display: "flex",
        alignItems: "center",
        width: "100%"
    },
    searchBarInput: {
        width: "100%",
        backgroundColor: "var(--bg-light)",
        border: "1px solid transparent",
        borderRadius: "6px",
        padding: "12px 50px 12px 20px",
        fontSize: "14px",
        color: "var(--text-dark)",
        outline: "none",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
    },
    searchLensButton: {
        position: "absolute",
        right: "6px",
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "16px",
        padding: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "4px",
        transition: "transform 0.1s ease"
    },
    suggestionsCardLayer: {
        position: "absolute",
        top: "52px",
        left: 0,
        right: 0,
        backgroundColor: "var(--white)",
        zIndex: 1100,
        borderRadius: "6px",
        boxShadow: "var(--shadow-md)",
        overflow: "hidden",
        border: "1px solid var(--border-color)"
    },
    suggestionRow: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
        padding: "12px 20px",
        cursor: "pointer",
        borderBottom: "1px solid var(--bg-light)",
        transition: "background 0.15s ease"
    },
    suggestionThumb: {
        width: "35px",
        height: "45px",
        objectFit: "cover",
        borderRadius: "2px"
    },
    suggestionTitle: {
        fontSize: "13px",
        fontWeight: "700",
        color: "var(--text-dark)"
    },
    suggestionMeta: {
        fontSize: "11px",
        color: "var(--text-muted)",
        marginTop: "2px"
    },
    rightActionsCluster: {
        display: "flex",
        alignItems: "center",
        gap: "30px"
    },
    bagActionLink: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textDecoration: "none",
        color: "var(--text-dark)",
        cursor: "pointer",
        transition: "opacity 0.2s ease"
    },
    actionLabelText: {
        fontSize: "12px",
        fontWeight: "700",
        marginTop: "4px",
        textTransform: "uppercase",
        letterSpacing: "0.5px"
    },
    accountHubWrapper: {
        position: "relative"
    },
    profileActivationTrigger: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer"
    },
    userAvatarIcon: {
        fontSize: "20px"
    },
    profileActionText: {
        fontSize: "12px",
        fontWeight: "700",
        marginTop: "4px",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        color: "var(--text-dark)"
    },
    accountDropdownFlyout: {
        position: "absolute",
        top: "55px",
        right: "-10px",
        backgroundColor: "var(--white)",
        width: "220px",
        boxShadow: "0 10px 30px rgba(40, 44, 63, 0.15)",
        border: "1px solid var(--border-color)",
        borderRadius: "8px",
        zIndex: 1200,
        padding: "10px 0",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
    },
    welcomeSalutationHeader: {
        padding: "12px 20px",
        fontSize: "14px",
        textAlign: "left"
    },
    dropdownSeparatorLine: {
        height: "1px",
        backgroundColor: "var(--border-color)",
        margin: "4px 0"
    },
    dropdownOptionRow: {
        textDecoration: "none",
        color: "var(--text-dark)",
        fontSize: "13px",
        fontWeight: "600",
        padding: "12px 20px",
        textAlign: "left",
        cursor: "pointer",
        transition: "background 0.2s ease"
    },
    dropdownLogoutButton: {
        background: "none",
        border: "none",
        color: "var(--primary-pink)",
        fontWeight: "700",
        fontSize: "13px",
        padding: "12px 20px",
        textAlign: "left",
        cursor: "pointer",
        width: "100%",
        transition: "background 0.2s ease"
    },
    guestLoginButton: {
        textDecoration: "none",
        padding: "10px 24px",
        fontSize: "13px",
        borderRadius: "4px",
        letterSpacing: "0.5px",
        display: "inline-block"
    }
};

export default Navbar;