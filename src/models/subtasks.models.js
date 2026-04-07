import mongoose from "mongoose";


const subTaskSchema=new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  ParentTask:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Task"
  },
  description:{
    type:String,
    required:true,
  },
  isCompleted:{
    type:Boolean,
    required:true,
    default :true
  },
  createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }
  
},{timestamps:true})



export const Subtask=mongoose.model("Subtask",subTaskSchema)