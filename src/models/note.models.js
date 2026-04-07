import mongoose from "mongoose";


const NoteSchema=new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }
  ,
  description:{
    type:String,
    required:true
  },
  Project:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Project"
  },
},{timestamps:true})

export const Note=mongoose.model("Note",NoteSchema)
