const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authroutes");
const profileRoutes = require("./routes/profileRoutes");
const productRoutes = require("./routes/ProductRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "StudentMart API is running"
    });
});

// Request logging
app.use((req, res, next) => {
    console.log("Incoming request:", req.method, req.originalUrl);
    next();
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/products", productRoutes);

// Unknown API routes
app.use("/api", (req, res) => {
    res.status(404).json({
        message: "API endpoint not found"
    });
});

// MongoDB connection
const PORT = process.env.PORT || 5002;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });