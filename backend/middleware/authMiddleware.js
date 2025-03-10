import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Middleware to protect routes
export const protect = async (req, res, next) => {
    let token

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = await User.findById(decoded.user.id).select("-password") // Exclude password
            next()
        } catch (error) {
            console.log("Token verification failed", error)
            res.status(401).json({ success: false, message: "Not Authorized, token failed" })
        }
    } else {
        res.status(401).json({ success: false, message: "Not authorized, no token provided" })
    }
}

// Middleware to check if the use is an Admin
export const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next()
    } else {
        res.status(403).json({ success: false, message: "Not Authorized as an admin" })
    }
}


