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

          body("username")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("username is required!")

     ]
}

export const changepasswordValidator=()=>{
     return [
          body("oldPassword")
          .trim()
          .notEmpty()
          .withMessage("password is required!")
          .isLength({min:5})
          .withMessage("minimum password length must be 6"),
           body("newPassword")
          .trim()
          .notEmpty()
          .withMessage("password is required!")
          .isLength({min:5})
          .withMessage("minimum password length must be 6")
     ]
}

export const EmailValidator=()=>{
     return [
          body("email")
            .trim()
            .notEmpty()
            .withMessage("email is required!")
            .isEmail()
            .withMessage("please enter valid email!")
     ]
}

export const resetPasswordValidator=()=>{
     return [
          body("password")
            .trim()
            .notEmpty()
            .withMessage("email is required!")
            .isEmail()
            .withMessage("please enter valid email!")
     ]
}


export const createAndupdateProjectValidators=()=>{
     return [
          body("projectName")
          .trim()
          .notEmpty()
          .withMessage("projectname shouldn't be empty.")
          ,
          body("description")
          .optional()
          .trim()
          .notEmpty()
          .withMessage("description shouldn't be empty.")
          ,
          body("isCompleted")
          .notEmpty()
          .withMessage("project status should not be empty.")
          .isBoolean()
          .withMessage("project status should be boolean.")
          ,
          body("deadline")
          .trim()
          .notEmpty()
          .withMessage("deadline is required.")

     ]
}

export const addMembervalidator=()=>{
     return [
          body("username")
          .trim()
          .notEmpty()
          .withMessage("username is required.")
          ,
          body("role")
          .trim()
          .notEmpty()
          .withMessage("role is required.")
     ]
}

export const updateRolevalidator=()=>{
     return [
          body("role")
          .trim()
          .notEmpty()
          .withMessage("role is required.")
          
     ]
}



