import multer from "multer";
import { upload } from "../middlewares/multer.middleware.js";

import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

export const router=Router();

router.post("/register",upload.single("avatar"),registerUser)