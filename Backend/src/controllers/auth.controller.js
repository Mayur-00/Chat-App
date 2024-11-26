import express from "express";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js";

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



export const login =  (req,res) =>{
    res.send("Signup route");
};


export const logout =  (req,res) =>{
    res.send("Signup route");
};