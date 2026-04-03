import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import dotenv from 'dotenv'
dotenv.config({path:"./.env"})


cloudinary.config({
   api_key:process.env.CLOUDINARY_API_KEY,
   api_secret:process.env.CLOUDINARY_API_SECRET,
   cloud_name:process.env.CLOUDINARY_CLOUD_NAME
   
})

export
 const uploadOnCloudinary=async(localFilePath)=>{
  try {
   
     const uploadResult=await cloudinary.uploader.upload(localFilePath,{
      resource_type:"auto"
     })


     if(uploadResult){
      fs.unlinkSync(localFilePath)
     }


     return uploadResult


  } catch (error) {

     console.error("file couldnt be saved to cloudinary",error)
     fs.unlinkSync(localFilePath)

  }
}