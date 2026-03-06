import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../middleware/generateTokenAndSetCookie.js";
import { User } from "../models/User.js";

const validTokens = new Set();

/* LOGIN */
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        /* Check ban status */
        if (user.banned) {
            if (user.banExpires && new Date() < user.banExpires) {
                return res.status(403).json({
                    success: false,
                    message: `Account banned until ${user.banExpires}`
                });
            }

            /* Auto unban if ban expired */
            user.banned = false;
            user.banExpires = null;
            await user.save();
        }

        generateTokenAndSetCookie(res, user._id);

        const userObj = user.toObject();
        delete userObj.password;

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: userObj
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


/* LOGOUT */
export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};


/* VERIFY TOKEN */
export const verify = (req, res) => {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ")
        ? auth.slice(7)
        : (req.query.token || "");

    if (token && validTokens.has(token)) {
        return res.json({ ok: true });
    }

    return res.status(401).json({ ok: false });
};


/* REGISTER */
export const register = async (req, res) => {
    try {
        const { username, fullName, email, password, address } = req.body;

        /* Required fields */
        if (!username || !fullName || !email || !password) {
            return res.status(400).json({
                message: "username, fullName, email and password are required"
            });
        }

        if (!address || typeof address !== "object") {
            return res.status(400).json({
                message: "address must be provided"
            });
        }

        const { street, city, country } = address;

        if (!street || !city || !country) {
            return res.status(400).json({
                message: "address.street, address.city and address.country are required"
            });
        }

        /* Check duplicate users */
        const existing = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { username }
            ]
        });

        if (existing) {
            if (existing.email === email.toLowerCase()) {
                return res.status(409).json({ message: "Email already in use" });
            }
            return res.status(409).json({ message: "Username already in use" });
        }

        /* Hash password */
        const hashedPassword = await bcrypt.hash(password, 10);

        /* Create user */
        const newUser = new User({
            username,
            fullName,
            email: email.toLowerCase(),
            password: hashedPassword,
            address: {
                street,
                city,
                state: address.state || null,
                postalCode: address.postalCode || null,
                country
            }
        });

        await newUser.save();

        /* Generate login token */
        generateTokenAndSetCookie(res, newUser._id);

        const userObj = newUser.toObject();
        delete userObj.password;

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            user: userObj
        });

    } catch (err) {

        if (err?.code === 11000) {
            const dupKey = Object.keys(err.keyPattern || {}).join(", ");
            return res.status(409).json({
                message: `Duplicate key: ${dupKey}`
            });
        }

        console.error("Register error:", err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


export default {
    login,
    verify,
    register,
    logout
};