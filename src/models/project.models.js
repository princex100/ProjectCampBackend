import mongoose, { mongo } from "mongoose";


const projectSchema=new mongoose.Schema({
  name:{
    type:String,
    required:true,
    unique:true,
    trim:true

  },
  description:{
    type:String,
    required:true,
    unique:true,
    trim:true

  }
  ,
  createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }


  // ,
  // tasks:[
  //   {
  //     type:mongoose.Schema.Types.ObjectId,
  //     ref:"Task"
  //   }
  // ],
  // notes:[
  //   {
  //     type:mongoose.Schema.Types.ObjectId,
  //     ref:"Note"
  //   }
  // ],
  ,

  
  deadline:{
    type:Date,
  },
  isCompleted:{
    type:Boolean,
    
  }

},{timestamps:true})

export const Project=mongoose.model("Project",projectSchema)