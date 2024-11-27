import express from"express";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"

import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { connectDB } from "./lib/db.js";

const app = express();
dotenv.config()
app.use(cookieParser())
app.use(express.json())
const port =process.env.PORT || 5001

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)














connectDB()
.then(() => {
    app.listen(port,() => {
        console.log("app is listening on port:" + port);
        
    });

})
