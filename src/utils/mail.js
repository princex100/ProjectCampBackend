import Mailgen from "mailgen";
 import nodemailer from "nodemailer"


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
      host:process.env.MAILTRAP_SMTP_HOST,
      port:process.env.MAILTRAP_SMTP_PORT,
      secure:false,
      auth:{
        user:process.env.MAILTRAP_SMTP_USER,
        pass:process.env.MAILTRAP_SMTP_PASS
      }
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
    console.error(error)
        
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
const resetPasswordMailgenContent=(username,passwordRestUrl)=>{

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
  ,resetPasswordMailgenContent
}


