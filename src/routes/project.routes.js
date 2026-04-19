import { Router } from "express";
import { validateJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { addMember, createProject, deleteProject, getProjectDetails, getProjects, listmembers, removeMember, updateProject, updateRole } from "../controllers/project.controllers.js";


export const router=Router()

router.get("",validateJWT,upload.none(),getProjects)
router.post("",validateJWT,upload.none(),createProject)
router.post("/:projectid/members",validateJWT,upload.none(),addMember)
router.get("/:projectid/members",validateJWT,upload.none(),listmembers)
router.put("/:projectid",validateJWT,upload.none(),updateProject)
router.get("/:projectid",validateJWT,upload.none(),getProjectDetails)
router.delete("/:projectid",validateJWT,upload.none(),deleteProject)
router.put("/:projectid/members/:userid",validateJWT,upload.none(),updateRole)
router.delete("/:projectid/members/:userid",validateJWT,upload.none(),removeMember)