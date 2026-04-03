import multer from "multer";
import { upload } from "../middlewares/multer.middleware.js";
import { LoginValidator, registerValidator } from "../../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";
import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";

export const router=Router();

router.post("/register",upload.single("avatar"),registerValidator(),validate,registerUser)


router.get("/login",LoginValidator(),validate,upload.none(),loginUser);