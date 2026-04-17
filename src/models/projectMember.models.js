import mongoose from "mongoose";
import { AvailableUserRoles,UserRolesEnum } from "../constants.js";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const projectmemberSchema=new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
  project:{
     type:mongoose.Schema.Types.ObjectId,
    ref:"Project",
    required:true,
  },
  role:{
    type:String,
    enum:AvailableUserRoles,
    default:UserRolesEnum.MEMBER
  }

},{timestamps:true})


projectmemberSchema.plugin(mongooseAggregatePaginate)
export const Projectmember=mongoose.model("Projectmember",projectmemberSchema)