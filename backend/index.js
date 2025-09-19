import express from "express";
import dotenv from "dotenv";
dotenv.config()
import connectDB from "./config/db.js";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import geminiResponse from "./gemini.js";


const app = express()
app.use(cors(
    {
        origin:"https://nexa-virtual-assistant.onrender.com",
        credentials:true
    }
))
const port = process.env.PORT || 8000;

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);


app.listen(port,() =>{
    connectDB()
    console.log("Server started successfully")
})
