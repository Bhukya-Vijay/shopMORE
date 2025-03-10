import express from 'express'
import multer from 'multer'
import Cloudinary from 'cloudinary'
import streamifier from 'streamifier'

import dotenv from 'dotenv'

dotenv.config()
const router = express.Router()

// Cloudinary configuaration
Cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_SECRET
})

// multer setup using memory storage
const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post("/", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(404).json({ message: "No file uploaded" })
        }

        // Function to handle the stream upload to Cloudinary
        const streamUpload = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                const stream = Cloudinary.v2.uploader.upload_stream((error, result) => {
                    if (result) {
                        resolve(result)
                    } else {
                        reject(error)
                    }
                })
                // User streamifier to convert file buffer to stream
                streamifier.createReadStream(fileBuffer).pipe(stream)
            })
        }

        // call the streamUpload function
        const result = await streamUpload(req.file.buffer)

        // Respond with the uploaded image URL
        res.json({ imageUrl: result.secure_url })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server Error" })
    }
})

export default router