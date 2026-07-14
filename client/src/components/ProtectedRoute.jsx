import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, token } = useContext(AuthContext);

    // 1. If the user is not authenticated at all, kick them to the login page
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // 2. If specific roles are required (e.g., ['admin']) and the user doesn't match, block access
    if (allowedRoles && !allowedRoles.includes(user.usertype)) {
        return <Navigate to="/" replace />;
    }

    // 3. If they pass all security checks, render the actual page component
    return children;
};

export default ProtectedRoute;