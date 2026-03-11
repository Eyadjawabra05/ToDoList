const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



//register user 

const register = async(req,res) => {

     try{

        const {userName,email,password} = req.body;

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({message:"User already exist"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = await User.create({
           email,
           userName,
           password:hashedPassword
        });
        
        const token = jwt.sign({id:newUser.id},process.env.JWT_SECRET,{expiresIn:"1h"});
        
        res.status(201).json({message:"user created sucessfully", token});

     }
     catch(error){
        console.error(`Error in user registration :`,error);
        return res.status(500).json({message:"Internal server error"});
     }

 
};

// login 
const login = async (req,res) => {

   try{
     
      const {email,password} = req.body;

      const user = await User.findOne({email});
      if(!user){
         return res.status(404).json({message:"User not found"});
      }

      const isPasswordValid = await bcrypt.compare(password,user.password);
      if(!isPasswordValid){
         return res.status(401).json({message:"invalid credintials"});
      }

      const token = jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:"1h"});

      res.status(200).json({message:"user logged in sucessfully",token});
    
      
   }catch(error){
      console.error(`Error in user login :`,error);
      return res.status(500).json({message:"Internal server error"});
   }



};

// getme
const getMe = async(req,res) => {

    try{

      const user = await User.findById(req.user.id).select('-password');
      res.status(200).json({user});

    }catch(error){
      res.status(500).json({message:error.message});
    }


};


module.exports = {register,login,getMe};
