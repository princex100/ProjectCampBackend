import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { User } from "../models/user.models.js";

export const emailVerification=asyncHandler(async(req,res,next)=>{
  if(!req.body){
    throw new ApiError(400,"please enter email!")
  }
  const {email}=req.body;

  if(!email){
    throw new ApiError(400,"email is required!")

  }

  const user=await User.findOne({email})

  if(!user){
    throw new ApiError(400,"invalid credentials!")
  }

  if(!user.isEmailVarified){
    throw new ApiError(400,"please verify your email")
  }

  next();

})