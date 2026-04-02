import crypto from "crypto"
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { emailVerificationMailgenContent } from "../utils/mail.js";
import { sendEmail } from "../utils/mail.js";



export const healthcheck=asyncHandler(async(req,res,next)=>{
     const mailgenContent=emailVerificationMailgenContent("prince","test.url");
     const options={
      subject:"testing email feature",
      MailgenContent:mailgenContent
     }

     const emailresponse=await sendEmail(options)

   

  res.status(200).json(
     
    new ApiResponse(200,"success",{message:"app working!!!!"})
  )

})
