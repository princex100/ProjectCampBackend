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
  },

  deadline:{
    type:String,
  },

  isCompleted:{
    type:Boolean,
    default:false
    
  }

},{timestamps:true})

export const Project=mongoose.model("Project",projectSchema)