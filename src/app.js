import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";


  const app=express();


app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(urlencoded({extended:true}))
export{app}

