import { NextFunction, Request, Response } from 'express';
import UserRepository from '../repositories/users';
import * as bcrypt from "bcryptjs";
export default async (req: Request, res: Response, next: NextFunction)=>{
    const user = req.user;

    if(!user){
        res.status(200).json({status:false,message:"please login"});
        return;
    }
    if(user["is_admin"]){
        next();
    }else{
        res.status(200).json({status:false,message:"You are not admin!"});
        return;
    }
}