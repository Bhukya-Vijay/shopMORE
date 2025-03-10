import express from 'express'
import { admin, protect } from '../middleware/authMiddleware.js'
import Product from '../models/Product.js'


const router = express.Router()

// @router /api/admin/products
// @desc Get all products (Admin only)
// @access Private/Admin
router.get("/", protect, admin, async (req, res) => {
    try {
        const product = await Product.find({})
        res.status(200).json(product)
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: "Server Error" })
    }

})

export default router