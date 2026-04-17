import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { Projectmember } from "../models/projectMember.models.js";
import mongoose from "mongoose";


export const getProjects=asyncHandler(async(req ,res ,next )=>{
   
  const userid=req.user._id;
  console.log(2);
  
  if(!userid){
    throw new ApiError(400,"userid invalid")
  }

 const projects=await Projectmember.aggregate([
    {
      $match:{
        user:userid
      }
    }
    ,
    {
      $lookup:{
        from:"projects",
        let:{projectid:"$project"},
        pipeline:[
          {
             $match:{
               $expr:{$eq:["$_id","$$projectid"]}
             }
          },
         
        ],
        as:"project"
      }
    },
    {
      $project:{
        project:{$arrayElemAt:["$project",0]}
      }
    }
    ,
    {
      $group:{
        _id:null,
        project:{$push:"$project"}
      }
    }
  ])

  if(!projects){
    throw new ApiError(400,"couldn't fetched project")
  }
 console.log(projects);
 

  // res.status(200).json("ok")
  res.status(200)
  .json(
    new ApiResponse(200,"projects fetched.",projects[0].project)
  )

})


export const createProject=asyncHandler(async(req,res,next)=>{
   if(!req.body){
    throw new ApiError(400,"all fields are required!")
   }

  const {projectName,description,deadline,iscompleted}=req.body


  const fields=[projectName,description,deadline,iscompleted]


  let isEmpty=fields.some(e=>e==="")


  if(isEmpty){
    throw new ApiError(400,"all fields are required!")
  }


  let completed=false;

  if(iscompleted==="true"){
    completed=true
  }


  const project=await new Project({
    name:projectName,
    description,
    deadline,
    isCompleted:completed,
    createdBy:req.user._id,
    
  })
   const projMember=await Projectmember.create({
    project:project._id,
    user:req.user._id,
    role:"project_admin"
  })
 await project.save()


 
  
  
  res.status(200).json(
    new ApiResponse("project created successFully!",200,project)
  )
   
})

// export const getProjectDetails=asyncHandler(async(req,res,next)=>{
//   const {projectId}=req.params
//   const {role}=req.body

//   const project=await Project.findById(projectId)

//   if(!project){
//     throw new ApiError(400,"project doesn't exist!")
//   }

//   if(role==='admin'){
     
//   }
//   else if(role==="project-admin"){
     
//   }
//   else if(role==="member"){

//   }
//   else{
//     throw new ApiError(400,"invalid role!")
//   }


// })

export const addMember=asyncHandler(async(req,res)=>{

   const userid=req.user._id
   const username=req.body.username;
   const {projectid}=req.params
   const role=req.body.role;




   if(!username){
    throw new ApiError(400,"please enter user.")
   }

   if(!userid||!projectid){
    throw new ApiError(400,"invalid request.")
   }

    if(!role){
    throw new ApiError(400,"enter all the fields.")
  }



   const ismemberregistered=await User.findOne({username:username})

   if(!ismemberregistered){
    throw new ApiError(400,"member is not registered.")
   }

    
const ismemberexistinProjectMember=await Projectmember.findById(ismemberregistered._id)
   
if(ismemberexistinProjectMember){
  throw new ApiError(400,"member already exist in project.")
}
 const member =await Projectmember.create({
  user:ismemberregistered._id,
  project:projectid,
  role
 })


 res.status(200)
 .json(
  new ApiResponse(200,"member added successfully",member,true)
 )


})


export const listmembers=asyncHandler(async(req,res)=>{
    
  const {projectid}=req.params;
  
  if(!projectid){
    throw new ApiError(400,"couldn't get project id.")
  }
console.log(projectid);

  const projmembers= await Projectmember.aggregate([
    {
      $match:{
        project:new mongoose.Types.ObjectId(projectid)
      }
    }
    ,
    {
      $lookup:{
        from:"projects",
        let:{projectid:"$project"},
        pipeline:[
          {
            $match:{
              $expr:{$eq:["$_id","$$projectid"]}
            }
          },
          
        ],
        as:"project"
      }
    },
    // {
    //   $project:{
    //     proj:{$arrayElemAt:["$proj",0]}
    //   }
    // }
    
    {
      $lookup:{
        from:"users",
        let:{userid:"$user"},
        pipeline:[
          {
            $match:{
              $expr:{$eq:["$_id","$$userid"]}
            }
          },
        ],
        as:"user"
      }
    }
    // {
    //   $project:{
    //     user:{$arrayElemAt:["$user",0]}
    //   }
    // }
    
  ])
console.log(projmembers);

  if(projmembers.length===0){
    throw new ApiError(400,"no members found.")
  }

  res.status(200)
  .json(
    new ApiResponse(200,"members fetched successfully.",projmembers,true)
  )
})