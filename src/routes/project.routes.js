import { Router } from "express";
import { validateJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { addMember, createProject, getProjects, listmembers } from "../controllers/project.controllers.js";


export const router=Router()

router.get("",validateJWT,upload.none(),getProjects)
router.post("",validateJWT,upload.none(),createProject)
router.post("/:projectid/members",validateJWT,upload.none(),addMember)
router.get("/:projectid/members",validateJWT,upload.none(),listmembers)