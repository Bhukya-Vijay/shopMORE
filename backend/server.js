import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import userRoutes from './routes/UserRoute.js'
import ProductRoutes from './routes/ProductRoutes.js'
import cartRoutes from './routes/CartRoutes.js'
import checkoutRoutes from './routes/CheckoutRoutes.js'
import orderRoutes from './routes/OrderRoutes.js'
import uploadRoutes from './routes/UploadRoutes.js'
import subscriberRoute from './routes/SubscriberRoute.js'
import adminRoute from './routes/AdminRoutes.js'
import productAdminRoutes from './routes/ProductAdminRoutes.js'
import adminOrders from './routes/AdminOrderRoute.js'


const app = express()
app.use(express.json())
app.use(cors())


dotenv.config()


// connect to MongoDB

connectDB()

app.get("/", (req, res) => {
    res.send("WELCOME TO shopMORE API")
})

// API Routes
app.use("/api/users", userRoutes)
app.use("/api/products", ProductRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/checkout", checkoutRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api", subscriberRoute)

// Admin Routes
app.use("/api/admin/users", adminRoute)
app.use("/api/admin/products", productAdminRoutes)
app.use("/api/admin/orders", adminOrders)

export default app


