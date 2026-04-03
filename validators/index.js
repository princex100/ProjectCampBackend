import { body } from "express-validator";


export const registerValidator=()=>{
  return [
    body("email")
         .trim()
         .isEmpty()
         .withMessage("email is required")
         .isEmail()
         .withMessage("incorrect email format")
         ,
    body("password")
         .trim()
         .isEmpty()
         .withMessage("password is required")
         .isLength({min:6})
         .withMessage("minimum password length should be six")
         ,
    body("username")
         .trim()
         .isEmpty()
         .withMessage("username is required")

    
  ]
}