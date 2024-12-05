import express from"express";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import { app, server,  } from "./lib/socket.js";
import path from "path";


dotenv.config()
app.use(cookieParser())
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
const port =process.env.PORT || 5001;
const __dirname= path.resolve();

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)



if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../Frontend/dist")))
};

app.get("*", (req,res)=>{
    res.sendFile(path.join(__dirname, "../Frontend", "dist", "index.html"))
})

connectDB()
.then(() => {
   server.listen(port,() => {
        console.log("app is listening on port:" + port);
        
    });

})
