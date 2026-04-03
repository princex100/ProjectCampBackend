import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { model } from "mongoose";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail.js";
import path from "path"

const generateAccessandRefreshToken=async(userId)=>{
  try {
    const user=await User.findById(userId)
    console.log(user);
    
     
     const AccessToken= user.generateAccessToken()
    
     const RefreshToken=user.generateRefreshToken()
     

     
     
     
     user.refreshToken=RefreshToken
     user.accessToken=AccessToken
     
    

    const isSaved= await user.save();

    if(isSaved){
      return {AccessToken,RefreshToken}
    }

    

  } catch (error) {
   console.error(error)
    return false
  }
}

export const registerUser=asyncHandler(async(req,res,next)=>{
  console.log(req?.body);


//  VALIDATING RESPONSE FROM CLIENT
     if(!req.body){
        res.status(401).json(
          new ApiError(401,"All fields are required!")
        )
     }
     
     const {username, email,password,fullname}=req.body

     const arr=[username,email,password,fullname]

     const isFieldEmpty= arr.some(field=>field?.trim()==="");

    if(isFieldEmpty){
      res.status(401).json(
        new ApiError(401,"all fields are required!")
      )
      
    const userExisted=await User.findOne({
      $or:[{username},{email}]
    })

    if(userExisted){
      throw new ApiError(409,"user already registered!")
    }

    }

  // VERYFYING FILE UPLOAD BY MULTER
     if(!req.file.path){
      res.status(401).json(
        new ApiError(401,"avatar is needed!")
      )
     }

  // UPLOADING FILE PERMANENTLY ON CLOUDINARY
     const avatarUrl= await uploadOnCloudinary(req.file.path);
      
     const userObj=await User.create({
      username,
      fullname,
      email,
      password,
      avatar:{
        url:avatarUrl.url
      }
     })
     

// GENERATING TOKENS FOR STORING IN USER OBJECT
   const {unhashedToken,hashedToken,tokenExpiry}= userObj.generateEmailVerificationToken()

   const {accessToken,refreshToken}= await generateAccessandRefreshToken(userObj._id)

    userObj.emailVerificationToken=hashedToken;
    userObj.emailVerificationExpiry=tokenExpiry;


// SAVING USER TO DB
    await userObj.save({validateBeforeSave:false})



// CREATING EMAIL BODY FOR SENDING MAILS
    const verificationUrl=`${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhashedToken}`
    const MailgenContent= emailVerificationMailgenContent(username,verificationUrl);
    


  // SENDING EMAIL
    await sendEmail({
      email:userObj?.email,
      name:username,
      subject:"email verification !",
      MailgenContent
    })



  // EXTRACTING STORED USER OBJECT FROM DB FOR RESPONSE
    const finalUserobj=await User.findById(userObj._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry ")




  // RETURNING FINAL RESPONSE
    res.status(200).json(
          new ApiResponse(200,"successfully registered user",finalUserobj)
        )
})