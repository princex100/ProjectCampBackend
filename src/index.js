import express from "express"
import { dbConnect } from "./db/db.js"
import dotenv from "dotenv"
import { app } from "./app.js";
import mongoose from "mongoose";
dotenv.config({path:"./.env"})



dbConnect()
.then(res=>{
  const appListening=app.listen(process.env.PORT)
    console.log("q")

  if(!appListening){
    console.log("q")
    process.exit(1);
  }
  console.log(mongoose.connection.name);
  


})
.catch(err=>{
 
console.error(err)
}
)