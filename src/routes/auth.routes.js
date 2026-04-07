import multer from "multer";
import { upload } from "../middlewares/multer.middleware.js";
import { LoginValidator, registerValidator } from "../../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";
import { Router } from "express";
import {  changePassword, forgotPassword, loginUser, logoutUser, refreshAccessToken, registerUser, resendEmailVerification, resetPassword } from "../controllers/user.controller.js";
import { validateJWT } from "../middlewares/auth.middleware.js";
import { currentUser } from "../controllers/user.controller.js";
import { changepasswordValidator } from "../../validators/index.js";
import { verifyEmail } from "../controllers/user.controller.js";
import { emailVerification } from "../middlewares/email-verification.middleware.js";
import { EmailValidator,resetPasswordValidator } from "../../validators/index.js";

export const router=Router();

// INSECURE ROUTES --BEFORE OR DURING LOGIN

router.post("/register",upload.single("avatar"),registerValidator(),validate,registerUser)

router.get("/login",LoginValidator(),validate,upload.none(),emailVerification,loginUser);

router.get("/verify-email/:emailVerificationToken",verifyEmail);

router.get("/resend-email-verification",upload.none(),EmailValidator(),validate,resendEmailVerification);

router.get("/refresh-token",upload.none(),refreshAccessToken);

router.get("/forgot-password",emailVerification,forgotPassword);

router.get("/reset-password/:incomingToken",upload.none(),resetPasswordValidator(),validate,resetPassword);



// SECURE ROUTES --AFTER LOGIN

router.get("/current-user",validateJWT,currentUser);

router.post("/change-password",validateJWT,upload.none(),changepasswordValidator(),validate,changePassword);

router.get("/logout",upload.none(),validateJWT,logoutUser);


