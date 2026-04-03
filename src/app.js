import express, { response, Router, urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app=express();



app.use(express.json())

app.use(cors({
  origin:process.env.CORS_ORIGIN?.split(",")|| "http://localhost:5173",
  credentials:true,
  methods:["GET","POST","PUT","DELETE","PATCH"],
  allowedHeaders:["Content-Type","Authorisation"]

}))
app.use(cookieParser())
app.use(urlencoded({extended:true}))
app.use(express.static("public"))

console.log(1);

import { router as Authrouter} from "./routes/user.routes.js";

app.use("/api/v1/auth",Authrouter)



import { router as Healthrouter } from "./routes/healthcheck.routes.js";

app.use("/api/v1/",Healthrouter)


export{app}

