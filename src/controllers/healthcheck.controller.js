
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

export const healthcheck=asyncHandler(async(req,res,next)=>{
console.log(3);

  res.status(200).json(
    new ApiResponse(200,"success",{message:"app working!!!!"})
  )

})