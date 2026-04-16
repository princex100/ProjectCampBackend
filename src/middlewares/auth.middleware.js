import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken"

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