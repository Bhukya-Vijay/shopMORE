import express from 'express'
import { admin, protect } from '../middleware/authMiddleware.js'
import Order from '../models/Order.js'


const router = express.Router()

// @Route GET api/admin/orders
// @desc get all orders
// @access Private/Admin
router.get("/", protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate("user", "name email")
        res.status(200).json(orders)
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: "Server Error" })
    }
})

// @Route PUT /api/admin/orders/:id
// @desc Update order status
// @access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name")
        if (order) {
            order.status = req.body.status || order.status
            order.isDelivered = req.body.status === "Delivered" ? true : order.isDelivered
            order.deliveredAt = req.body.status === "Delivered" ? Date.now() : order.deliveredAt

            const updatedOrder = await order.save()
            res.status(200).json(updatedOrder)
        } else {
            res.status(400).json({ message: "Order not found" })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: "Server Error" })
    }
})

// @Route DELETE /api/admin/routes/:id
// @desc delete an order
// @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
        if (order) {
            await order.deleteOne()
            res.status(200).json({ success: true, message: "Order removed successfully" })
        } else {
            res.status(404).json({ message: "Order not found" })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server Error" })
    }
})

export default router