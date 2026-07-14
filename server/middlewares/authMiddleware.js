import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "shopez_secret_key_123";

// Middleware to verify if a user is logged in
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization denied. Token required." });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Contains userId and usertype
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired session token." });
    }
};

// Middleware to verify if the logged-in user is an Admin
export const verifyAdmin = (req, res, next) => {
    // First run the token verification
    verifyToken(req, res, () => {
        if (req.user.usertype !== "admin") {
            return res.status(403).json({ message: "Access forbidden. Admin role required." });
        }
        next();
    });
};