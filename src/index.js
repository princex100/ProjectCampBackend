import express from "express"
import { dbConnect } from "./db/db.js"
import dotenv from "dotenv"
import { app } from "./app.js";
dotenv.config({path:"./.env"})



dbConnect()
.then(res=>{
  const appListening=app.listen(process.env.PORT)
    console.log("q")

  if(!appListening){
    console.log("q")
    process.exit(1);
  }


})
.catch(err=>{
  // const error=new ApiError(500,"couldn't connect to database")
  // next(error)
console.error(err)
}
)