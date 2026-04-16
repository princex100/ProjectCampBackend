import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import mongoose, { model } from "mongoose";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail.js";
import path from "path"
import { access } from "fs";
import { response } from "express";
import jwt from "jsonwebtoken"
import crypto from "crypto"
import bcrypt from "bcrypt"
import { resetPasswordMailgenContent } from "../utils/mail.js";


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
      },
      

     })
     

// GENERATING TOKENS FOR STORING IN USER OBJECT
   const {unhashedToken,hashedToken,tokenExpiry}= userObj.generateTemperoryToken()

  //  const {accessToken,refreshToken}= await generateAccessandRefreshToken(userObj._id)

    userObj.emailVerificationToken=hashedToken;
    userObj.emailVerificationExpiry=tokenExpiry;


// SAVING USER TO DB
    await userObj.save({validateBeforeSave:false})



// CREATING EMAIL BODY FOR SENDING MAILS
console.log(req.protocol);

    const verificationUrl=`${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unhashedToken}`
    const MailgenContent= emailVerificationMailgenContent(username,verificationUrl);
    


  // SENDING EMAIL
   await sendEmail({
      email:userObj?.email,
      name:username,
      subject:"email verification !",
      MailgenContent
    })

    

    await userObj.save({validateBeforeSave:false})

  // EXTRACTING STORED USER OBJECT FROM DB FOR RESPONSE
    const finalUserobj=await User.findById(userObj._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry ")




  // RETURNING FINAL RESPONSE
    res.status(200).json(
          new ApiResponse(200,"successfully registered user",finalUserobj)
        )
})



export const loginUser=asyncHandler(async(req,res)=>{


// VALIDATING INCOMING DATA AFTER EXPRESS-VALIDATOR
console.log(req.cookies

);

  if(!req.body){
    throw new ApiError(400,"all fields are required!")
  }

  const {email , username,password}=req.body;


  if(!email&&!username){
    throw new ApiError("username or password id required")
  }


// CHECKING IF USER REGISTERED OR NOT
 const user=await User.findOne({
  $or:[{email},{username}]
 })



 if(!user){
  throw new ApiError(400,"user doesn't exist. Register first!")
 }


// VERIFYING PASSWORD IS CORRECT OR NOT
 const IsPasswordCorrect=await user.isPasswordCorrect(password)

 if(!IsPasswordCorrect){
  throw new ApiError(400,"login failed! incorrect password")
 }


// GENERATING TOKENS TO SEND IN COOKIES
 const {AccessToken,RefreshToken}=await generateAccessandRefreshToken(user._id)


// FETCHING FINAL USER OBJECT FROM DB TO SEND TO CLIENT
const finalUser=await User.findById(user._id).select("-password -refreshToken -accessToken -emailVerificationToken -emailVerificationExpiry")


// SENDING FINAL RESPONSE

const options={
  httpOnly:true,
  secure:true
}
 res
 .status(200)
 .cookie("accesstoken",AccessToken,options)
 .cookie("refreshtoken",RefreshToken,options)
 .json(
  new ApiResponse("logged in successfully!",200,{
    userData:finalUser,
    accessToken:AccessToken,
    refreshToken:RefreshToken
  })
 )



})



export const logoutUser=asyncHandler(async(req,res,next)=>{
    const user=await User.findByIdAndUpdate(req.user._id,{
        $set:{
          refreshToken:""
        }
        },
       
      )


      const options={
        httpOnly:true,
        secure:true
      }


      res.status(200)
      .clearCookie("accesstoken",options)
      .clearCookie("refreshtoken",options)
      .json(
        new ApiResponse(200,"logged out Successfully!")
      )
})



export const currentUser=asyncHandler(async(req,res,next)=>{
   const userid=req.user._id
   const user=await User.findById(userid).select("-password -refreshToken -forgotPasswordToken -forgotPasswordExpiry -emailVerificationToken -emailVerificationExpiry")
   const id=new mongoose.Types.ObjectId(user._id)
   
   console.log(user._id,id);
   

   res.status(200)
   .json(
    new ApiResponse("userdata fetched",200,user)
   )
})



export const changePassword=asyncHandler(async(req,res,next)=>{
  
  const userid=req.user._id;

  const {oldPassword,newPassword}=req.body;

  const user=await User.findById(userid)


  if(!user){
    throw new ApiError(400,"invalid credentials!")
  }

  const passwordCorrect=await bcrypt.compare(oldPassword,user.password)

  if(!passwordCorrect){
    throw new ApiError(400,"invalid credentials!")
  }


  user.password=newPassword;

  await user.save()

  
  res.status(200)
  .json(
    new ApiResponse("password updated successfully!",200)
  )
})



export const verifyEmail=asyncHandler(async(req,res,next)=>{
  const {emailVerificationToken}=req.params
  
  if(!emailVerificationToken){
    throw new ApiError(400,"email verification token is missing!")
  }

      const HashedToken=crypto.createHash("sha256")
      .update(emailVerificationToken)
      .digest("hex")

      const user= await User.findOne({
        emailVerificationToken:HashedToken,
        emailVerificationExpiry:{$gt:Date.now()}
      })

      if(!user){
        new ApiError(400,"token is invalid or token has Expired!")
      }

      user.isEmailVarified=true;
      user.emailVerificationToken=undefined;
      user.emailVerificationExpiry=undefined
      await user.save({validateBeforeSave:false})

      res.status(200)
      .json(
        new ApiResponse(200,"email verified successfully!")
      )

  
})



export const resendEmailVerification=asyncHandler(async(req,res,next)=>{
 
   const {email}=req.body

  //  CHECKING EMAIL HAS COME OR NOT
   if(!email){
    throw new ApiError(400,"email is required!");
   }


  // FINDING USER BY EMAIL
   const user=await User.findOne({email})


  // EITHER USER DOESNT EXIST OR EMAIL IS WRONG 
   if(!user){
      return res.status(200)
       .json(
        new ApiResponse("if this email exist , then email verification has been sent succesfully!",200)
   )

   }

  // GENERATING TOKENS AGAIN CAUSE NEW VERIFICATION LINK IS GOING TO BE SENT
   const {unhashedToken,hashedToken,tokenExpiry} = user.generateTemperoryToken()


  // UPDATING TOKENS
   user.emailVerificationToken=hashedToken;
   user.emailVerificationExpiry=tokenExpiry;


    await user.save()

// SENDING EMAIL AGAIN
   const validationUrl=`${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unhashedToken}`

    const emailBody=emailVerificationMailgenContent(user.username,validationUrl)

    const options={
      MailgenContent:emailBody,
      email,
      subject:"resend request of email verification"
    }

    await sendEmail(options)

// SENDING FINAL RESPONSE
   res.status(200)
   .json(
    new ApiResponse("email verification resend succesfully!",200)
   )


})



export const refreshAccessToken=asyncHandler(async(req,res,next)=>{

  const incomingToken=req.cookies.refreshtoken || req.body.refreshtoken;

  if(!incomingToken){
    throw new ApiError(400,"refreshToken not found . login again!")
  }

  try {
     const decodedToken=jwt.verify(incomingToken,process.env.REFRESH_SECRET_KEY);

     const user=await User.findById(decodedToken._id);

     if(!user){
      throw new ApiError(400,"user not found!")
     }

     if(user.refreshToken!==incomingToken){
      throw new ApiError(400,"unauthorized access!")
     }

     const newrefreshToken=await user.generateRefreshToken();
     const newaccessToken=await user.generateAccessToken();

     user.refreshToken=newrefreshToken;
     await user.save({validateBeforeSave:false})
      
     const options={
      httpOnly:true,
      secure:true
     }

     return res.status(200)
     .cookie("refreshtoken",newrefreshToken,options)
     .cookie("accesstoken",newaccessToken,options)
     .json(
        new ApiResponse("tokens refreshed successfully!",200)
     )
    
  } catch (error) {
      throw new ApiError(401,"tokens are tempered or expired or invalid!")
  } 
})



export const forgotPassword=asyncHandler(async(req,res,next)=>{

// WHEN USER CLICKS FORGOT PASSWORD EMAIL IS SENT HERE
  const {email}=req.body;
  
// CHECKING INPUT
  if(!email){
     throw new ApiError(400,"please enter email.")
  }

// FETCHING USER
  const user=await User.findOne({
    $or:[{email}]
  })

// SENDING GENEREL RESPONSE IF EMAIL IS INCORRECT OR USER NOT FOUND
  if(!user){
     return res.status(200)
     .json(
      new ApiResponse("if this email exist, then the email has been sent!")
     )
  }


  if(user.email!==email){
     return res.status(200)
     .json(
      new ApiResponse("if this email exist, then the email has been sent!")
     )
     
  }


// GENERATING TOKENS
  const {unhashedToken,hashedToken,tokenExpiry}=await user.generateTemperoryToken();

  user.forgotPasswordToken=hashedToken;
  user.forgotPasswordExpiry=tokenExpiry;
  

// SAVING NEW USER OBJECT
  await user.save()

// SENDING EMAIL TO USER --\\-- USER CLICKS AND REDIRECTED TO FRONTEND PAGE FOR RESET PASSWORD
  const resetUrl=`${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unhashedToken}`

  const emailBody=resetPasswordMailgenContent(user.username,resetUrl);

  const options={
    subject:"reset password link",
    email,
    MailgenContent:emailBody
  }

  await sendEmail(options)


// SENDING FINAL RESPONSE
  return res.status(200)
     .json(
      new ApiResponse("if this email exist, then the email has been sent!")
     )
  
})



export const resetPassword=asyncHandler(async(req,res,next)=>{

// WHEN USER CLICKS ON EMAIL RESET PASSWORD LINK , IT REDIRECTS TO FRONTEND FORM PAGE FOR RESET PASSWORD , WHERE USER ENTERS HIS NEW PASSWORD AND CLICKS ON RESET PASSWORD , THEN FROM THERE BACKEND RESET PASSWORD URL WITH RESET TOKEN IS SEND TO BACKEND AND HERE WE GET TOKEN AND PASSWORD

  const {password}=req.body;

  const {incomingToken}=req.params;

// VERIFYING INPUTS
  if(!password){
    throw new ApiError(400,"please enter Password!")
  }

  if(!incomingToken){
    throw new ApiError(400,"missing reset token!")
  }
 
// GENERATING AND MATCHING TOKEN WITH RESET TOKEN STORED IN DB
  const newhashedtoken= crypto.createHash("sha256")
  .update(incomingToken)
  .digest("hex")
            

// FETCHIG USER BASED ON TOKEN


  const user=await User.findOne({
    forgotPasswordToken:newhashedtoken,
    forgotPasswordExpiry:{$gt:Date.now()}

  });


  if(!user){
    throw new ApiError(404,"token is expired or invalid")
  }

// IF USER FOUND SET TOKEN AND PASSWORD UNDEFINED 
// UPDATE PASSWORD
  user.password=password;
  user.forgotPasswordToken=undefined;
  user.forgotPasswordExpiry=undefined;

// SAVING NEW USER OBJECT
  await user.save();


// SENDING FINAL RESPONSE
  res.status(200)
  .json(
    new ApiResponse("password reset successfully!",200)
  )

})