import { Router } from "express";
import { validateJWT,roleBasedPermission } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { addMember, createProject, deleteProject, getProjectDetails, getProjects, listmembers, removeMember, updateProject, updateRole } from "../controllers/project.controllers.js";
import { AvailableUserRoles, UserRolesEnum } from "../constants.js";
import { updateRolevalidator,createAndupdateProjectValidators,addMembervalidator } from "../../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";


export const router=Router()

router.get("",validateJWT,upload.none(),getProjects)
router.post("",validateJWT,createAndupdateProjectValidators(),validate,upload.none(),createProject)
router.post("/:projectid/members",validateJWT,addMembervalidator(),validate,upload.none(),addMember)
router.get("/:projectid/members",validateJWT, upload.none(),listmembers)
router.get("/:projectid",validateJWT,upload.none(),getProjectDetails)


// PERMISSION BASED ACCESS
router.put("/:projectid",validateJWT,createAndupdateProjectValidators(),validate,roleBasedPermission([UserRolesEnum.ADMIN,UserRolesEnum.PROJECT_ADMIN]),upload.none(),updateProject)
router.delete("/:projectid",validateJWT,roleBasedPermission([UserRolesEnum.ADMIN,UserRolesEnum.PROJECT_ADMIN]) ,upload.none(),deleteProject)
router.put("/:projectid/members/:userid",validateJWT,updateRolevalidator(),validate,roleBasedPermission([UserRolesEnum.ADMIN,UserRolesEnum.PROJECT_ADMIN]),upload.none(),updateRole)
router.delete("/:projectid/members/:userid",validateJWT,roleBasedPermission([UserRolesEnum.ADMIN,UserRolesEnum.PROJECT_ADMIN]),upload.none(),removeMember) 