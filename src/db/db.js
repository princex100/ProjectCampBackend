import mongoose from "mongoose";
export const dbConnect = async () => {
    try {
      const connect= await mongoose.connect(process.env.MONGO_URL)

      mongoose.connection.on("error",(err)=>{
        console.error(err)
      })
      
    } catch (error) {
       console.error(error)
       process.exit(1);
    }
};

