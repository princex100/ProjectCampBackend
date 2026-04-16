import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { Projectmember } from "../models/projectMember.models.js";


export const getProjects=asyncHandler(async(req ,res ,next )=>{
  const userid=req.user._id;
   console.log(userid);

  const memberIn=await Projectmember.find({user:userid})

  if(!memberIn){
    return res.status(200).json(
      new ApiResponse("no projects found",200)
    )
  }
console.log(memberIn);

const projects=[];


   for (const e of memberIn) {
     const project=await Project.findById(e.project);
      console.log("printing one");
      
      project.role=e.role;
      console.log(project);

       projects.push(project);
   }
    // memberIn.for(async(e)=>{
    //   const project=await Project.findById(e.project);
    //   console.log("printing one");
      
    //   project.role=e.role;
    //   console.log(project);

    //   return projects.push(project);
    // })
    
    console.log(projects);
    

  res.status(200).json(
    new ApiResponse("projects fetched!",200,projects)
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


  const project=await Project.create({
    name:projectName,
    description,
    deadline,
    isCompleted:completed,
    createdBy:req.user._id,
    
  })


  await Projectmember.create({
    project:project._id,
    user:req.user._id,
    role:"project_admin"
  })
  
  
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