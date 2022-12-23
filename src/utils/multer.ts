// tslint:disable:no-null-keyword
import * as multer from 'multer';

const Storage = (dir:string,root:string)=>{
 return multer.diskStorage({
    destination: function (req, file, cb) {
      if(file)
      cb(null, root+dir);
    },
    filename: function (req, file, cb) {
      const fileName = file?.originalname?.split(" ");
      cb(null, Date.now() + fileName?.join("_"));
    }
  });
}


const fileFilter = (req, file, cb) => {
  console.log("file",file)
  if ( file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png' ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const getUpload = (dir,root="./uploads")=>{
  const storage=Storage(dir,root);
  const upload = multer({
    storage,
    limits: {fileSize: "5MB", 
      fieldSize: "5MB"},
    fileFilter,
  });
  return upload;
}


export default getUpload;