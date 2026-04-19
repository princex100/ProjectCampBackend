import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken"
import { Projectmember } from "../models/projectMember.models.js";
import mongoose from "mongoose";

export const validateJWT=asyncHandler(async(req,res,next)=>{

  
  const accessToken=req.cookies.accesstoken|| req.header("Authorization")?.replace("Bearer ","");
  const refreshToken=req.cookies.refreshtoken|| req.header("Authorization")?.replace("Bearer ","");

  if(!accessToken&&!refreshToken){

      throw new ApiError(400,"login first!")
  }
  

  try {
     const decodedToken=jwt.verify(accessToken,process.env.ACCESS_SECRET_KEY)

     const user=await User.findById(decodedToken._id)

  if(!user){
    throw new ApiError(400,"user not found!.Register again.")
  }

  req.user=user
  return next()
  } catch (error) {
     throw new ApiError(400,"token is expired or tampered")
  }


})

export const roleBasedPermission=(arr=[])=>{
  return asyncHandler(async(req,res,next)=>{
      const {projectid}=req.params
      const userid=req.user._id;
    
    if(!projectid){
      throw new ApiError(400,"projectid is invalid.")
    }
    if(!userid){
      throw new ApiError(400,"invalid user.")
    }
    
    
      const user=await Projectmember.findOne({
      $and:[{user:new mongoose.Types.ObjectId(userid)},{project:new mongoose.Types.ObjectId(projectid)}]
    }
    )
    if(!user){
      throw new ApiError(400,"user not found in the project or project doesn't exist.")
    }
    if(arr.length===0){
      throw new ApiError(500,"internal server error.Can't find roles.")
    }
      if(!arr.includes(user?.role)){
        throw new ApiError(400,"not authorised.")
      }
    
      return next()

  })
}