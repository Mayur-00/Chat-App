import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if(!token){
            res.status(401).json({messsage:"Unauthorized! - not token provided"});
        };

        const decoded = jwt.verify(token, process.env.JWT_KEY);

        if(!decoded){
            res.status(401).json({messsage:"Unauthorized! - not token provided"})

        };

        const user = await User.findById(decoded.userid).select("-password");

        if(!user){
            res.status(404).json({message:"User Not Found!"})
        };

        req.user = user;    


        next();

 
    } catch (error) {
        console.log(`error in auth Middleware; ${error}`);
        res.status(500).json({message:"internal server error !!!!"})
       
    };

};