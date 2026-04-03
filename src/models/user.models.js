import mongoose, { model, Schema } from "mongoose";
import { AvailableUserRoles } from "../constants.js";
import bcrypt from "bcrypt"
import fs from "fs"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import dotenv from "dotenv"

dotenv.config({path:"./.env"})



const userSchema=new mongoose.Schema({
  avatar:{
     type:{
      url:String,
      localPath:String
     },
     default:{
      url:"https://placehold.co/200x200",
      localPath:""
     }
  },
  username:{
    type:String,
    required:true
  }
  ,
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true,
    unique:true
  },
    fullname:{
    type:String,
    required:true,
  },
  isEmailVarified:{
    type:Boolean,
    required:true
  },
  refreshToken:{
    type:String,

  },
   accessToken:{
    type:String,
    
  },
   forgotPasswordToken:{
    type:String,
    
  },
  forgotPasswordExpiry:{
    type:Date,
    
  },
  emailVerificationToken:{
    type:String
  }
  ,
  emailVerificationExpiry:{
    type:Date
  }
  
},{timestamps:true})





userSchema.pre("save",async function(next){
  if(!this.isModified("password"))return 

  this.password=await bcrypt.hash(this.password,10)
})





userSchema.methods.generateForgotPasswordToken=async function(){
     jwt.sign({
       username:this.username,
       fullname:this.fullname
      },
      process.env.FORGOT_PASSWORD_KEY,
      {
        expiresIn:String(this.forgotPasswordExpiry)
      }
    )
}



userSchema.methods.generateRefreshToken= function(){
  return jwt.sign(
    {
       _id:this._id,
       username:this.username,
       fullname:this.fullname,

    }
    ,
    process.env.REFRESH_SECRET_KEY,
    
    {
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
   
  )
}



userSchema.methods.generateEmailVerificationToken=function(){
    const unhashedToken=crypto.randomBytes(20).toString('hex')
     
    const hashedToken=crypto
              .createHash("sha256")
              .update(unhashedToken)
              .digest('hex')

    const tokenExpiry=Date.now()+(20*60*1000)

    return {unhashedToken,hashedToken,tokenExpiry}
}



userSchema.methods.generateAccessToken=function(){
  return jwt.sign(
    {
       _id:this._id,
       email:this.email,
       username:this.username,
       fullname:this.fullname,

    }
    ,
       process.env.ACCESS_SECRET_KEY,
    {
      expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}


userSchema.methods.isPasswordCorrect=async function(password){
  return bcrypt.compare(this.password,password)
  
}


export const User=mongoose.model("User",userSchema)