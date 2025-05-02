import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import chatRoutes from "./routes/chat.route.js"
import { connectDB } from "./lib/db.js";

dotenv.config()

const app = express()
const PORT = process.env.PORT

// not the best way
// app.get("/api/auth/signup", (req, res) => {
//     res.send("SignUp Route");
// })

app.use(express.json()); // takes the req in json format
app.use(cookieParser()); // allows us the access of the cookies in req

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/chat", chatRoutes)


app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port: ${PORT}`);
    
})