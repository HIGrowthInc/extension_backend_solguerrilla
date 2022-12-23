import users from "../repositories/users"
import { NextFunction, Request, Response } from 'express';
export default async (req: Request, res: Response, next: NextFunction)=>{
    try{
        const {email} = req.body;
        console.log(email)
        if(email && email !==""){
            const user =await users.readByEmail(email);
            if(user){
                res.status(200).json({
                    message: "Email is using now",
                  })
            }else{
                next();
            }
        }else{
            res.status(200).json({
                message: "Invalid value",
              })        
        }
    }catch(error){
        res.status(500).json({
            message: error
          })
    }
}