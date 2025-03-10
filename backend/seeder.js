import Product from "./models/Product.js"
import User from "./models/User.js"
import products from "./data/products.js"
import mongoose from "mongoose"
import dotenv from 'dotenv'
import Cart from "./models/Cart.js"


dotenv.config()

// Connect to mongoDB
mongoose.connect(process.env.MONGO_URI)

// Function to seed data

const seedData = async () => {
    try {
        // clear existing data
        await Product.deleteMany()
        await User.deleteMany()
        await Cart.deleteMany()

        // Create a default admin User
        const createdUser = await User.create({
            name: "Admin User",
            email: "admin@gmail.com",
            password: "admin@8745",
            role: "admin"
        })

        // Assign a default user ID for each product
        const userId = createdUser._id

        const sampleProducts = products.map((product) => {
            return { ...product, user: userId }
        })

        // Insert the products into the database
        await Product.insertMany(sampleProducts)
        process.exit()
    } catch (error) {
        console.error("Error seeding the data:", error)
        process.exit(1)
    }
}

seedData()