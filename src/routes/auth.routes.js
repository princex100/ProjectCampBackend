import multer from "multer";
import { upload } from "../middlewares/multer.middleware.js";
import { LoginValidator, registerValidator } from "../../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";
import { Router } from "express";
import {  changePassword, loginUser, logoutUser, refreshAccessToken, registerUser, resendEmailVerification } from "../controllers/user.controller.js";
import { validateJWT } from "../middlewares/auth.middleware.js";
import { currentUser } from "../controllers/user.controller.js";
import { passwordValidator } from "../../validators/index.js";
import { verifyEmail } from "../controllers/user.controller.js";
import { emailVerification } from "../middlewares/email-verification.middleware.js";

export const router=Router();

router.post("/register",upload.single("avatar"),registerValidator(),validate,registerUser)


router.get("/login",LoginValidator(),validate,upload.none(),emailVerification,loginUser);

router.get("/logout",upload.none(),validateJWT,logoutUser);
router.get("/current-user",validateJWT,currentUser);

router.post("/change-password",validateJWT,upload.none(),passwordValidator(),validate,changePassword);


router.get("/verify-email/:emailVerificationToken",verifyEmail);


router.get("/resend-email-verification",upload.none(),resendEmailVerification);

router.get("/refresh-token",upload.none(),refreshAccessToken);

