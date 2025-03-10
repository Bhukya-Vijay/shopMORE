import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import Order from '../models/Order.js'


const router = express.Router()
/*
// @Route POST /api/orders
// @desc Create new order
// @access Private
router.post("/", protect, async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body

        if (orderItems.length === 0) {
            return res.status(400).json({ message: "No order items" })
        }

        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            createdAt: Date.now() // Ensure createdAt is added
        })

        const createdOrder = await order.save()
        res.status(201).json(createdOrder)
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
})
*/

// @Route GET /api/orders/my-orders
// @desc Get logged-in user's orders
// @access Private
router.get("/my-orders", protect, async (req, res) => {
    try {
        // Find orders fo the authenticated user
        const orders = await Order.find({ user: req.user._id }).sort({
            createdAt: -1,
        }) // sort by most recent orders
        res.json(orders)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server Error" })
    }
})

// @Route GET /api/orders/:id
// @desc Get order details by ID
// @access Private
router.get("/:id", protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            "user",
            "name email"
        )

        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }

        // Return the full order details
        res.json(order)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server Error" })
    }
})

export default router