
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const authRoutes =
    require("./routes/authroutes");

const app = express();


// Middleware

app.use(cors());

app.use(express.json());


// Authentication routes

app.use(
    "/api/auth",
    authRoutes
);


// Home route

app.get("/", (req, res) => {

    res.json({

        message:
            "StudentMart API is running"

    });

});


// MongoDB connection

mongoose
    .connect(process.env.MONGO_URI)

    .then(() => {

        console.log(
            "MongoDB connected"
        );

        app.listen(
            process.env.PORT,
            () => {

                console.log(
                    `Server running on http://localhost:${process.env.PORT}`
                );

            }
        );

    })

    .catch((error) => {

        console.error(
            "MongoDB connection failed:",
            error.message
        );

    });