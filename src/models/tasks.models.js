import mongoose from "mongoose";
import { TaskStatusEnum,AvailableTaskStatuses } from "../constants.js";


const taskSchema=new mongoose.Schema({
  name:{
    type:String,
    required:true,
  },
  description:{
    type:String,
    required:true,

  }
  ,
  isTaskCompleted:{
    type:Boolean,
    required:true,

  },
  projectName:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Project"
  },
  assignedTo:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  assignedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  }
  ,
  status:{
    type:String,
    enum:TaskStatusEnum,
    default:AvailableTaskStatuses.TODO

  },
  attachments:{
    type:[
      {
        type:String,
        mimetype:String,
        size:Number
      }
    ],
    default:[]
  },
  

},{timestamps:true})



export const Task=mongoose.model("Task",taskSchema)