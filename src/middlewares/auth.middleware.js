import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken"

export const validateJWT=asyncHandler(async(req,res,next)=>{

console.log(req.cookies.accesstoken);

  const accessToken=req.cookies.accesstoken|| req.header("Authorization")?.replace("Bearer ","");
  if(!accessToken){
    throw new ApiError(400,"accessToken not found!")
  }
  

  try {
     const decodedToken=jwt.verify(accessToken,process.env.ACCESS_SECRET_KEY)
console.log(decodedToken);

  const user=await User.findById(decodedToken._id)

  if(!user){
    throw new ApiError(400,"user not found!")
  }

  req.user=user
  return next()
  } catch (error) {
     throw new ApiError(400,"token is expired or tampered")
  }


})