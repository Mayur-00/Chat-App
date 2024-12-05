import express from "express";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req,res) =>{
    const {fullName, email, password} = req.body;

    try {
        if(!fullName || !email || !password){
            return res.status(400).json({message:"All Fields Are Required !!!"})

            
        }
        if(password.length < 6){
            return res.status(400).json({message:"password Should be at least 6 charactors"})
        }
        const user = await User.findOne({email});
        if(user) return res.staus(400).json({message:"user already exist Please Login!"});

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password,salt);
        
        const newUser = new User({
            fullName,
            email,
            password:hashedPass
        });

        if(newUser){
            // generate webtokens
            generateToken(newUser._id,res);
            await newUser.save();
            
            res.status(201).json(
                {
                    _id: newUser._id,
                    fullName:newUser.fullName,
                    email:newUser.email,
                    profilePic:newUser.profilePic   
                }
            )

        }else{
            res.status(400).json({message:"invalid User Credentials"})
        };



        
    } catch (error) {
        console.log(`Error in Signup Controller: ${error}`);
        res.status(500).json({message:"internal server error"})
        
    };
};



export const login = async (req,res) =>{

    const {email, password} = req.body;

 try {
       const user = await User.findOne({email});
   
       if(!user){
           res.status(400).json({message:"invalid credentials"});
       };
   
       const isPasswordIsCorrect = await bcrypt.compare(password, user.password);
   
       if(!isPasswordIsCorrect){
           res.status(400).json({message:"invalid credentials"});
       };
   
       generateToken(user._id, res);
       res.status(200).json(
        
           {
               _id:user._id,
               fullname:user.fullName,
               email:user.email,
               profilePic:user.profilePic
           }
       );
 } catch (error) {
    console.log(`error in login controller ${error}`);
    res.status(500).json({message:"internal server error"});
    
 };
    
};


export const logout =  (req,res) =>{
       try {
         res.cookie("token", "",{maxAge:0})
         res.status(200).json({message:"Logged Out Succesfully"})
       } catch (error) {
        console.log(`error in logout controller: ${error}`);
        res.status(500).json({message:"internal server error"})
        
       }
};  

export const updateProfile = async (req,res) => {
try {
    
        const {profilePic} = req.body;
        const userid = req.user._id;
        
        if(!profilePic){
            return res.status(400).json({message:"profile picture is required"});
        }
    
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userid,{profilePic:uploadResponse.secure_url},{new:true});
    
        res.status(200).json(updatedUser);

} catch (error) {
    console.log(`error in updateProfile controller:  ${error}`);
    res.status(500).json({message:"internal server error!!"})
    
    
}




};


export const checkAuth = async (req,res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log(`error in checkAuth controller: ${error}`); 
    };
};