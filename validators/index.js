import { body } from "express-validator";


export const registerValidator=()=>{
  return [
    body("email")
         .trim()
         .notEmpty()
         .withMessage("email must not be empty")
         .isEmail()
         .withMessage("incorrect email format")
         ,
    body("password")
         .trim()
         .isLength({min:6})
         .withMessage("minimum password length should be six")
         ,
    body("username")
         .trim()
         .notEmpty()
         .withMessage("username is required")

    
  ]
}

export const LoginValidator=()=>{
     return [
          body("email")
            .optional()
            .trim()
            .isEmpty()
            .withMessage("email is required!")
            .isEmail()
            .withMessage("email format is required!"),
// body("password")
//          .trim()
//          .isLength({min:6})
//          .withMessage("minimum password length should be six"),
          body("username")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("username is required!")

     ]
}

export const passwordValidator=()=>{
     return [
          body("password")
          .trim()
          .notEmpty()
          .withMessage("password is required!")
          .isLength({min:5})
          .withMessage("minimum password length must be 6")
     ]
}