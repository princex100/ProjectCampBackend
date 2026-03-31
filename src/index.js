import express from "express"
import { dbConnect } from "./db/db"
import dotenv from "dotenv"
import { ApiError } from "./utils/ApiErrors";
import { app } from "./app";
dotenv.config({path:"./.env"})



dbConnect()
.then(res=>{
  const appListening=app.listen(process.env.PORT)

  if(!appListening){
    process.exit(1);
  }


})
.catch(err=>{
  const error=new ApiError(500,"couldn't connect to database")
  next(error)

}
)