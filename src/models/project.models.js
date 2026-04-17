import mongoose, { mongo } from "mongoose";
import { ApiError } from "../utils/ApiErrors.js";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


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
    
  },
 

},{timestamps:true})


projectSchema.plugin(mongooseAggregatePaginate)
// export const addProjMember=async(projMember)=>{
//   try {
//      await projectSchema.projectMember.push(projMember._id)
//   } catch (error) {
//      throw new ApiError(400,"couldn't add member to the project.Try again.")
//   }
// }
export const Project=mongoose.model("Project",projectSchema)