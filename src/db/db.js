import mongoose from "mongoose";
export const dbConnect = async () => {
    try {
      const connect= await mongoose.connect()

      mongoose.connection.on("error",(err)=>{
        console.error(err)
      })
      
    } catch (error) {
       console.error(error)
    }
};

