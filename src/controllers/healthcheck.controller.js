import crypto from "crypto"
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";



export const healthcheck=asyncHandler(async(req,res,next)=>{
    
  res.status(200).json(
     
    new ApiResponse(200,"success",{message:"app working!!!!"})
  )

})
