import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({
    limit: "16kb"
})) // to parse json data from request body
app.use(express.urlencoded({extended: true, limit: "16kb"})) // to parse urlencoded data from request body
app.use(express.static("public")) // to serve static files from the public directory
app.use(cookieParser()) // to parse cookies from the request headers

// import routes 
import userRouter from "./routes/user.routes.js"


// routes declaration 
app.use("/api/users", userRouter)
export { app };