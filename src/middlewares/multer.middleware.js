import multer from "multer";
import path from "path"
import fs from "fs"


const tempdir=path.resolve("public/temp");

if(!fs.existsSync(tempdir)){
 fs.mkdirSync(tempdir,{recursive:true})
}

const storage= multer.diskStorage({
  
destination:function(req,file,cb){

  cb(null,"public/temp")

}
  ,
  filename:function(req,file,cb){

    const uniqueprefix=Date.now();

    const fieldname=file.fieldname;
    
    const ext=path.extname(file.originalname);

   const filename=uniqueprefix+fieldname+ext;


    console.log(filename);
    

    cb(null,filename)
  }
})

export const upload= multer({storage})