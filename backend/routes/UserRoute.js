import express from 'express'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// @route POST /api/users/register
// @desc Regist a new User
// @access Public

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body

    try {
        // Register Login
        let user = await User.findOne({ email })
        if (user) return res.status(400).json({ success: false, message: "User already exists" })
        user = new User({ name, email, password })
        await user.save()

        // Create JWT Payload
        const payload = { user: { id: user._id, role: user.role } }

        //Sign and return the token along with user data
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" }, (error, token) => {
            if (error) throw error

            // Send the user and token in response
            res.status(201).json({
                success: true,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token
            })
        })


    } catch (error) {
        console.log(error)
        res.status(500).send("Server Error")
    }
})

// @route POST /api/users/login
// @desc Authenticate User
// access Public

router.post("/login", async (req, res) => {
    const { email, password } = req.body

    try {
        // Find User by email
        let user = await User.findOne({ email })

        if (!user) return res.status(400).json({ success: false, message: "Invalid Credentials" })
        const isPasswordMatch = await user.matchPassword(password)
        if (!isPasswordMatch) return res.status(400).json({ success: false, message: "Invalid Credentials" })

        // Create JWT Payload
        const payload = { user: { id: user._id, role: user.role } }

        //Sign and return the token along with user data
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" }, (error, token) => {
            if (error) throw error

            // Send the user and token in response
            res.json({
                success: true,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token
            })
        })

    } catch (error) {
        console.log(error)
        res.status(500).send("Server Error")
    }
})

// @route GET /api/users/profile
// @des Fet logged-in user's profile (Protected Route)
// @access Private

router.get("/profile", protect, async (req, res) => {
    res.json(req.user)
})




export default router