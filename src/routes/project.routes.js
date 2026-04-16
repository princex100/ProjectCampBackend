import { Router } from "express";
import { validateJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createProject, getProjects } from "../controllers/project.controllers.js";


export const router=Router()

router.get("",validateJWT,upload.none(),getProjects)
router.post("",validateJWT,upload.none(),createProject)