import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import {   Projectmember } from "../models/projectMember.models.js";
import mongoose from "mongoose";
import { refreshAccessToken } from "./user.controller.js";
import { AvailableUserRoles, UserRolesEnum } from "../constants.js";






export const getProjects=asyncHandler(async(req ,res ,next )=>{
   
  const userid=req.user._id;
  
  if(!userid){
    throw new ApiError(400,"userid invalid")
  }



  const projects=await Projectmember.aggregate([
    {
      $match:{
        user:new mongoose.Types.ObjectId(userid)
      }
    },
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
          {
            $lookup:{
              from:"projectmembers",
              let:{projid:"$_id"},
              pipeline:[
                {
                  $match:{
                    $expr:{$eq:["$project","$$projid"]}
                  }
                },
              ],
              as:"projectmembers"
            }
          },
          {
            $addFields:{
              members:{
                $size:"$projectmembers"
              }
            }

          }
        ],
        as:"project"
      }
    },

    {
      $unwind:"$project"
    },

    {
      $project:{
         project:{
          _id:1,
          members:1,
          name:1,
          description:1,
          isCompleted:1,
          createdBy:1
        },
        role:1
      }
    }

  ])



  if(!projects){
    throw new ApiError(400,"couldn't fetched project")
  }
 

    

  res.status(200)
  .json(
    new ApiResponse(200,"projects fetched.",projects)
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


  const project=await  Project.create({
    name:projectName,
    description,
    deadline,
    isCompleted:completed,
    createdBy:new mongoose.Types.ObjectId(req.user._id),
    
  })
   const projMember=await Projectmember.create({
    project:new mongoose.Types.ObjectId(project._id),
    user:new mongoose.Types.ObjectId(req.user._id),
    role:UserRolesEnum.PROJECT_ADMIN
  })




  res.status(201).json(
    new ApiResponse("project created successFully!",200,project)
  )
   
})



export const addMember=asyncHandler(async(req,res)=>{

   const userid=req.user._id
   const username=req.body.username;
   let {projectid}=req.params
   const role=req.body.role;
   projectid=new mongoose.Types.ObjectId(projectid)



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

    

const ismemberexistinProjectMember=await Projectmember.findOne({
  $and:[{user:new mongoose.Types.ObjectId(ismemberregistered._id)},{project:new mongoose.Types.ObjectId(projectid)}]
}
)
   
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


  const projmembers= await Projectmember.aggregate([
    {
      $match:{
        project:new mongoose.Types.ObjectId(projectid)
      }
    }
    ,
    //---------THIS IS FOR FETCHING PROJECT DETAILS ALSO.
    // {
    //   $lookup:{
    //     from:"projects",
    //     let:{projectid:"$project"},
    //     pipeline:[
    //       {
    //         $match:{
    //           $expr:{$eq:["$_id","$$projectid"]}
    //         }
    //       },
          
    //     ],
    //     as:"project"
    //   }
    // },
  
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
          {
            $project:{

              forgotPasswordToken:0,
              forgotPasswordExpiry:0,
              emailVerificationToken:0,
              emailVerificationExpiry:0,
              password:0,
              refreshToken:0

            }
          }
        ],
        as:"user"
      }
    }
   
  ])

  if(projmembers.length===0){
    throw new ApiError(400,"no members found.")
  }

  res.status(200)
  .json(
    new ApiResponse(200,"members fetched successfully.",projmembers,true)
  )
})



export const updateProject=asyncHandler(async(req,res)=>{

    if(!req.body){
    throw new ApiError(400,"all fields are required!")
   }

  const {projectName,description,deadline,iscompleted}=req.body

   const fields=[projectName,description,deadline,iscompleted]


  let isEmpty=fields.some(e=>e==="" || e===undefined)

  if(isEmpty){
    throw new ApiError(400,"enter all the fields.")
  }

  const {projectid}=req.params
  const userid=req.user._id;

if(!projectid){
  throw new ApiError(400,"projectid is invalid.")
}
if(!userid){
  throw new ApiError(400,"invalid user.")
}




  const isupdated=await Project.findByIdAndUpdate(projectid, {
  projectName: projectName,
  description: description,
  deadline: deadline,
  iscompleted: iscompleted
});

if(!isupdated){
  throw new ApiError(400,"project couldn't be updated. Try again.")
}


res.status(200)
.json(
  new ApiResponse(200,"project updated successfully.",isupdated)
)

})



export const getProjectDetails=asyncHandler(async(req,res)=>{



   const {projectid}=req.params
  const userid=req.user._id;

if(!projectid){
  throw new ApiError(400,"projectid is invalid.")
}
if(!userid){
  throw new ApiError(400,"invalid user.")
}


const user=await Projectmember.findOne({
  $and:[{user:userid},{project:projectid}]
})
 
const role=user.role===UserRolesEnum.ADMIN||user.role===UserRolesEnum.PROJECT_ADMIN?"allowed":"limited"
  const projDetails=await Project.aggregate([
    {
      $match:{
        _id:user.project
      }
    },
    {
      $project:role==="allowed"?{
         name:1,
         description:1,
         iscompleted:1,
         deadline:1,
         createdBy:1
      }
      :
      {
         name:1,
         description:1,
         iscompleted:1,
         deadline:1,
      }
    }
  ])
console.log(projDetails);

  if(projDetails.length===0){
    throw new ApiError(400,"no project found.")
  }

  res.status(200)
  .json(
    new ApiResponse(200,"project detailes fetched successfully.",projDetails)
  )
})



export const deleteProject=asyncHandler(async(req,res)=>{

     const {projectid}=req.params
  const userid=req.user._id;

if(!projectid){
  throw new ApiError(400,"projectid is invalid.")
}
if(!userid){
  throw new ApiError(400,"invalid user.")
}
const user=await Projectmember.findOne({
  $and:[{user:userid},{project:projectid}]
})

if(!user){
  throw new ApiError(400,"you are not a member of this project.")
}




const isdeleted=await Project.findByIdAndDelete(projectid)
const ismembersdeleted=await Projectmember.deleteMany({project:projectid})


if(!isdeleted){
  throw new ApiError(400,"couldn't delete project.")
}
if(!ismembersdeleted){
  throw new ApiError(400,"project deleted.But members couldnt be deleted.")
}

res.status(200)
.json(
  new ApiResponse(200,"project deleted Successfully.",isdeleted,true)
)

})



export const updateRole=asyncHandler(async(req,res)=>{

const {projectid,userid}=req.params
  const curruserid=req.user._id;
const newRole=req.body.role
if(!projectid){
  throw new ApiError(400,"projectid is invalid.")
}
if(!userid){
  throw new ApiError(400,"invalid userid.")
}
if(!curruserid){
  throw new ApiError(400,"invalid user.")
}
if(!newRole){
  throw new ApiError(400,"please enter new role.")
}

if(!AvailableUserRoles.includes(newRole)){
  throw new ApiError(400,"please enter a valid new role.")

}





const member=await Projectmember.findOne({
  $and:[{user:new mongoose.Types.ObjectId(userid)},{project:new mongoose.Types.ObjectId(projectid)}]
})
console.log(member);

if(!member){
  throw new ApiError(400,"no member found.")
}

const updatedRole=await Projectmember.findByIdAndUpdate(
  member._id,
  {
    role:newRole
  }
)

if(!updatedRole){
  throw new ApiError(400,"couldn't update role.")

}

res.status(200)
.json(
  new ApiResponse(200,"role updated successfully.",updateRole)
)
  
})



export const removeMember=asyncHandler(async(req,res)=>{

  const {projectid,userid}=req.params
  const curruserid=req.user._id;


if(!projectid){
  throw new ApiError(400,"projectid is invalid.")
}
if(!userid){
  throw new ApiError(400,"invalid userid.")
}
if(!curruserid){
  throw new ApiError(400,"invalid user.")
}





 
const member=await Projectmember.findOne({
  $and:[{user:new mongoose.Types.ObjectId(userid)},{project:new mongoose.Types.ObjectId(projectid)}]
})

if(!member){
  throw new ApiError(400,"no member found.")
}

const deletemember=await Projectmember.findByIdAndDelete(member._id);

if(!deletemember){
  throw new ApiError(400,"couldn't delete member")
}

res.status(200)
.json(
  new ApiResponse(200,"member deleted successfully.",deletemember)
)


})







