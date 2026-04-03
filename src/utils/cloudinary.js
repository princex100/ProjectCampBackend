import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import dotenv from 'dotenv'
dotenv.config({path:"./.env"})
cloudinary.config({
  api_key:"812587683573526",
  api_secret:"eScZ-brHLsP5WhVghsNMgeLro7c",
  cloud_name:"dlt7eyo7p"
  
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