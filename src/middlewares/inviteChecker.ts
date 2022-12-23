import users from "../repositories/users"
import { NextFunction, Request, Response } from 'express';
import InviteRepository from "../repositories/invite";
export default async (req: Request, res: Response, next: NextFunction)=>{
    const {id} = req.body;
    const inviteRecord = await InviteRepository.readByHash(id);
    if(!inviteRecord){
        res.status(200).json({status:false,message:"There is no invite"});
        return;
    }
    
    next();
}