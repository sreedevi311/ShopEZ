import { User } from "../models/userSchema.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "shopez_secret_key_123";

// REGISTER LOGIC
export const registerUser = async (req, res) => {
    try {
        const { username, password, email, usertype } = req.body;

        if (!username || !password || !email) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "Username or Email already registered." });
        }

        const newUser = new User({
            username,
            password, // Plain text to match your current schema structure
            email,
            usertype: usertype || "customer"
        });

        await newUser.save();
        console.log(res.status(201).json({ message: "User registered successfully!" }));
        res.status(201).json({ message: "User registered successfully!" });

    } catch (error) {
        console.log(res.status(500).json({ message: "Server error during registration.", error: error.message }));
        res.status(500).json({ message: "Server error during registration.", error: error.message });
    }
};

// LOGIN LOGIC
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.password !== password) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const token = jwt.sign(
            { userId: user._id, usertype: user.usertype },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Login successful!",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                usertype: user.usertype
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error during login.", error: error.message });
    }
};