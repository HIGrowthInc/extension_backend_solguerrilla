import { NextFunction, Request, Response } from 'express';
import { IUser } from 'src/models/users';
import * as bcrypt from "bcryptjs";
import UserRepository from '../repositories/users';
import { generateHash, generateRandom } from '../utils';
import InviteRepository from "../repositories/invite";
import { sendEmail } from '../utils/nodemailer';
import CRedis from '../utils/redis';
import { IInvite } from 'src/models/invite';
import ConnectionRepository from '../repositories/connection';
import { IConnection } from 'src/models/connection';
import AccountTypeRepository from '../repositories/account_type';
import UpgradeRepository from '../repositories/upgrade';
import { IUpgrade } from '../models/upgrade';

export default class InviteController {
    redisHandle = CRedis.getInstance();
    constructor() {
       
    }
    signUp = async (req: Request, res: Response, next: NextFunction)=>{
        try{
            const {id} = req.body;
            console.log("id",id)
            const {password,first_name,last_name} = req.body;

            const inviteRecord = await InviteRepository.readByHash(id);
            if(!inviteRecord){
                return;
            }
            const email = inviteRecord.email!;
            console.log("email",email)            
            if(!password)
            {
                res.status(200).json({
                status:false,
                message:"password is invalid"
                })
                return;
            }
            
            const random = generateRandom();    
            await this.redisHandle.setObject(email,{random:random,password:password,first_name:first_name,last_name:last_name},1000*60);
            console.log("email",email);
            await sendEmail(email,"Verify Email","<html><body><h1>"+random+"</h1></body></html>");
            res.status(200).json({
                status:true,
                message:"Email is sent.please verify your email."
            })
            return;
        }catch(error){
            res.status(500).json({
                status:false,
                error:error
            })
        }

    }
    invite_mailVerify =async (req: Request, res: Response, next: NextFunction)=>{
        const {id} = req.body;
        const {random} = req.body;

        const _accountlist=await AccountTypeRepository.readAll();
        const accountlist = _accountlist[0];
        if(!accountlist)
        {
            res.status(200).json({staus:false,message:"there is no accout type"});
            return;
        }

        try{
            // console.log("-------",id)
            const inviteRecord = await InviteRepository.readByHash(id);
            console.log("invitere",inviteRecord)
            if(!inviteRecord) return;
            if(inviteRecord.joined_at) {
                res.status(200).json({status:false,message:"you already joind"});
                return;
            }
            const email = inviteRecord.email;
            
            if(email!="" && email){
                console.log("email",email)
                const valueObjec = await this.redisHandle.getObject(email);
                console.log("hash compare",random == valueObjec.random);
                if(random == valueObjec.random){
                    let _firstLevelId = await AccountTypeRepository.readAll();
                    const firstLevelId = _firstLevelId[0].id!;
                    console.log("valueof",valueObjec);
                    const createdUser=await this.createUserRecord("",email,valueObjec.password,valueObjec.first_name,valueObjec.last_name,"","","",firstLevelId,"",res);
                    
                    inviteRecord.joind_at = new Date();
                    inviteRecord.is_joined = 1;
                    await InviteRepository.update(inviteRecord);
                    
                    const connRecord = await this.createConnectionRecord(inviteRecord,createdUser.id!);

                    res.status(200).json({status:true,message:"Sucessfull!, Please login with extension!"});
                    return;
                  }else{
                    res.status(200).json({
                      status:false,
                      message:"code is wrong!"
                    })
                  }
            }else{
                res.status(200).json({
                status:false,
                message:"email is invalid"
                })
            }
            
           
        }catch(error){
            res.status(500).json({status:false,error:error});
        }
    }
    invite_accept = async (req: Request, res: Response, next: NextFunction)=>{
            const {id} = req.body;
            console.log("id",id)
            try{
                const inviteRecord =await InviteRepository.readByHash(id);
                if(!inviteRecord){
                    return;
                }
                if(inviteRecord.is_accept){
                  res.status(200).json({status:false,message:"you accepted already"});
                  return;
                }
                inviteRecord.is_accept = 1;
                inviteRecord.accept_at = new Date();
                await InviteRepository.update(inviteRecord);
                res.status(200).json({status:true,message:"successful"});
                // send sign up page to user
            }catch(error){
                res.status(500).json({status:false,error:error});
            }
    }
    invite_mail = async (req: Request, res: Response, next: NextFunction)=>{
      const {fromEmail,toEmail} = req.body;
      
      if(!fromEmail || !toEmail){
        res.status(200).json({
          status:false,
          message:"Invalid email"
        })
        return;
      }
      if(fromEmail==toEmail){
        res.status(200).json({
          status:false,
          message:"you can't invite to you"
        })
        return;
      }
      const hash = generateRandom().toString();
      try{
      
        const fromUser = await UserRepository.readByEmail(fromEmail);
        if(!fromUser){
          res.status(200).json({
            status:false,
            message:"you are invalid user"
          })
          return;
        }
        const base_url = req.protocol + '://' + req.get('host')
        await sendEmail(toEmail,"Verify Email","<html><body><a href="+base_url+"/invite/sign_up/"+hash+">"+base_url+"/"+hash+"</a></body></html>");
        const inviteData = InviteRepository.makeInviteData(fromUser.id!,toEmail,0,0,hash,new Date(),null,null);
        console.log("invitedata",inviteData)
        const inviteRecord  = await InviteRepository.create(inviteData as IInvite);
        res.status(200).json({
          status:true,
          message:"invite successful!"
        })

        return;
      }catch(error){
        res.status(500).json({
          status:false,
          error:error
        })
      }
    }
    invite = async (req: Request, res: Response, next: NextFunction)=>{
      const {id} = req.params;
      console.log("id",id);
      // res.send()
    }
// --------------------------function ---------------
    
    createUserRecord = async (
      username:string,
      email:string,
      password:string,
      first_name:string,
      last_name:string,
      city : string ,
      state : string ,
      country : string ,
      account_type:number,
      image_url : string ,
      res:Response
    )=>{
    
        const hash=await bcrypt.hash(password, 12);
        const userRecord = await UserRepository.create({
            username:username,
            email:email,
            password: hash,
            first_name:first_name,
            last_name:last_name,
            city:city,
            state:state,
            country:country,
            image_url:image_url,
            is_admin:0,
            account_type:account_type,
            created_at:new Date()
        } as IUser); 
        return userRecord;
    }

    createConnectionRecord = async(inviteRecord:IInvite,followId:number):Promise<IConnection>=>{
        const user_id = inviteRecord.user_id;
        let totalMember=0;
        const latestConnectRecordOfUser = await ConnectionRepository.readLatestConnectionByUserId(user_id);
        if(latestConnectRecordOfUser){
            totalMember= latestConnectRecordOfUser.total_member;
        }
        totalMember +=1;
        console.log("totalNumber",totalMember)
        const follow_id = followId;
        const create_at = new Date();
        const connectionData = ConnectionRepository.makeConnectionData(user_id,totalMember,follow_id,create_at);
        const connRecord=await ConnectionRepository.create(connectionData as IConnection);
        await this.udpateAccountLevel(user_id,totalMember);
        return connRecord;
    }
    udpateAccountLevel = async (user_id:number,total_member:number)=>{
        const user = await UserRepository.readById(user_id);
        if(!user)return;
        
        const currentAccontType = await AccountTypeRepository.readById(user.account_type);
        if(!currentAccontType) return;

        const toAccountType = await AccountTypeRepository.readLevelWithMemCount(total_member);
        if(!toAccountType) return;

        if(currentAccontType.level < toAccountType.level) {
            user.account_type = toAccountType.id!;
            const upgradeData = UpgradeRepository.makeSupportProjectData(user.id!,toAccountType.id!,new Date())
            await UpgradeRepository.create(upgradeData as IUpgrade);
            await UserRepository.update(user);
        }
    }
    
    
}