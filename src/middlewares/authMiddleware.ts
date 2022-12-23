import { NextFunction, Request, Response } from 'express';
import UserRepository from '../repositories/users';
import * as bcrypt from "bcryptjs";
export default async (req: Request, res: Response, next: NextFunction)=>{
        if(req.isAuthenticated()){
            next();
            return;
        }   else{
            res.status(200).json({sataus:false,message:"Please Login"});
            return;
        } 
}