import multer from "multer";
import { upload } from "../middlewares/multer.middleware.js";
import { registerValidator } from "../../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";
import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

export const router=Router();

router.post("/register",registerValidator(),validate,upload.single("avatar"),registerUser)