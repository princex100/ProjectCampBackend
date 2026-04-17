import Mailgen from "mailgen";
 import nodemailer from "nodemailer"
import { ApiError } from "./ApiErrors.js";


// this function initiates the email sending process


export const sendEmail=async(options)=>{
         
  
     const mailgenerator=new Mailgen({
               theme:"default",
               product:{
                   name:"PrinceTransports.PVT.LTD",
                   link:"http://testing123.com"
                  }
               })



    const emailTextual=mailgenerator.generate(options.MailgenContent);
    const emailHtml=mailgenerator.generate(options.MailgenContent);


    // creating connection with the SMTP server who will actually send emails
    const transporter=nodemailer.createTransport({
      service:"gmail",
      auth:{
        user:"princeshrm002@gmail.com",
        pass:"iajq samr setu zmod"
      }
      // host:process.env.MAILTRAP_SMTP_HOST,
      // port:process.env.MAILTRAP_SMTP_PORT,
      // secure:false,
      // auth:{
      //   user:process.env.MAILTRAP_SMTP_USER,
      //   pass:process.env.MAILTRAP_SMTP_PASS
      // }
    })

     const email={
         from:"PrinceDaddy@gmail.com",
         to:options.email,
         subject:options.subject,
         text:emailTextual,
         html:emailHtml
      }


    // sending request to SMTP server to send the final structured email to desired user
      try {
         await transporter.sendMail(email)
      } catch (error) {
        throw new ApiError(400,"email couldn't be sent .Try again.")
      }
}



// generating email html body for email verification process
const emailVerificationMailgenContent=(username,verificationUrl)=>{
 

 const email={
  body:{
    name:username,
    intro:"Welcome to our App ! we are exited to have you on board.",
    action:{
      instructions:"to verify your email please click on the following button",
      button:{
        color:"#22BC66",
        text:"verify your email",
        link:verificationUrl

      }
    },
    outro:"Need help, or have questions? Just reply to this email , we'd love to help."
  }
}
return email

}


// html email body for password reset
export const resetPasswordMailgenContent=(username,passwordRestUrl)=>{

const email={
  body:{
    name:username,
    intro:"We got a request to rest the password of your account",
    action:{
      instructions:"to reset your password please click on the following button",
      button:{
        color:"#22BC66",
        text:"reset your password",
        link:passwordRestUrl

      }
    },
    outro:"Need help, or have questions? Just reply to this email , we'd love to help."
  }
}
return email
}


export  {emailVerificationMailgenContent
  
}


