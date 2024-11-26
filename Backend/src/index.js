import express from"express";
import authRoutes from "./routes/auth.route.js"
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js";

const app = express();
dotenv.config()

const port =process.env.PORT || 5001


app.use("/api/auth", authRoutes)














connectDB()
.then(() => {
    app.listen(port,() => {
        console.log("app is listening on port:" + port);
        
    });

})
