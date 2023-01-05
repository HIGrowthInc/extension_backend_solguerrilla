import { NextFunction, Request, Response } from 'express';
import { IUser } from 'src/models/users';
import * as bcrypt from "bcryptjs";
import UserRepository from '../repositories/users';
import { generateRandom, REFRESH_CONFIG } from '../utils';
import { EmailContent } from '../utils/nodemailer';
import CRedis from '../utils/redis';
import AccountTypeRepository from '../repositories/account_type';
import { COOKIE_OPTIONS, getRefreshToken, getToken } from '../utils/refreshToken';
import * as  jwt from 'jsonwebtoken'
import passport from '../utils/passport';
import BackgroundRepository from '../repositories/background';
import background from '../repositories/background';
const path = require("path");
const  fs = require('fs');
export default class AuthController {
    redisHandle = CRedis.getInstance();
    constructor() {
       
    }
    updateProfile = async (req: Request, res: Response, next: NextFunction)=>{
      const {email,first_name,last_name,city,state,country,isUpdate} = req.body;

      if(!email){
        res.status(200).json({
          status:false,
          message:"Email is Invalid"
        });
        return;
      }
      try{
        // const url = req.protocol +"://"+req.get('host');
        const user = await UserRepository.readByEmail(email);
        
       
        if(!user)
        {
          res.status(200).json({status:false,message:"dont exist user"});
          return;
        }
       
       
    
          const userUpdate ={
            ...user,
            first_name:first_name,
            last_name:last_name,
            city:city,
            state:state,
            country:country,
            is_init:1,
          }
        const updateUser =await UserRepository.update(userUpdate);
        res.status(200).json({status:true,user:updateUser});
        return;  
      }catch(err){
        res.status(500).json(err);
        return;
      }
    }
    success=async (req: Request, res: Response, next: NextFunction)=>{
        res.status(200).json({
            message: "User successfully created",
          })
    }
    
     
    mailVerify = async (req: Request, res: Response, next: NextFunction)=>{
      const {random,email} = req.body;
      const accountlist=await AccountTypeRepository.readAll();
      
    
      if(accountlist.length==0)
      {
        res.status(200).json({staus:false,message:"there is no accout type"});
        return;
      }
      try{
        if(email!="" && email){
          
          const valueObjec = await this.redisHandle.getObject(email);
          if(random == valueObjec.random){
            let firstLevel = await AccountTypeRepository.readAll();
    
            let firstLevelId = firstLevel[0].id!;
            await this.createUserRecord("",email,valueObjec.password,"","","","","","",firstLevelId,res);
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
          res.status(500).json({
            status:false,
            error:error
          })
      }
      
    }
    create_profile = async (req: Request, res: Response, next: NextFunction)=>{
      const {email,first_name,last_name,city,state,country,isUpdate} = req.body;

      if(!email){
        res.status(200).json({
          status:false,
          message:"Email is Invalid"
        });
        return;
      }
      try{
        // const url = req.protocol +"://"+req.get('host');
        const user = await UserRepository.readByEmail(email);
        
        if(!user)
        {
          res.status(200).json({status:false,message:"dont exist user"});
          return;
        }
       
       
    
          const userUpdate ={
            ...user,
            first_name:first_name,
            last_name:last_name,
            city:city,
            state:state,
            country:country,
            is_init:1,
            image_url:req['file'].filename
          }
        const updateUser =await UserRepository.update(userUpdate);
        res.status(200).json({status:true,user:updateUser});
        return;  
      }catch(err){
        res.status(500).json(err);
        return;
      }
    }
    getProfileImg = (req: Request, res: Response, next: NextFunction)=>{
      const action = req.query.img;
      var filePath = path.join(__dirname,"../../../uploads/profile",action).split("%20").join(" ");
      // var filePath = path.join(__dirname,"../../uploads/profile",action).split("%20").join(" ");
      console.log("file path",filePath);
      fs.exists(filePath,(exists)=>{
        if(!exists){
          res.writeHead(404,{
            "Content-Type":"text/plain"
          });
          res.end("404 Not Found");
          return;
        }

        var ext = path.extname(action);
        var contentType = "text/plain";
        if(ext === ".png"){
          contentType = "image/png"
        }else if(ext ===".jpg" || ext ===".jpeg"){
          contentType = "image/jpeg"
        }
        res.set('Access-Control-Allow-Origin', '*');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
        res.writeHead(200,{
          "Content-Type":contentType,
          "Access-Control-Allow-Origin":"*"
        });
        fs.readFile(filePath,(err,content)=>{
          res.end(content);
        })
      })


      

    }
    forgotMail = async(req:Request,res:Response, next:NextFunction) =>{
      const {email} = req.body;
      if(!email){
        return res.status(200).json({status:false,message:"Please input email correctly"});
      }
     
          
      try{
        const userRecord = await UserRepository.readByEmail(email);
        if(!userRecord){
          return res.status(200).json({status:false,message:"There is no registered email"});
        }
        const random = generateRandom();
        console.log("random",random)
        await this.redisHandle.setObject(random.toString(),{email:email},1000*60);
        const base_url = req.protocol + '://' + req.get('host')
        await EmailContent(email,"Verify Email","<html><body><a href="+base_url+"/setNewPassword/"+random+">"+base_url+"/setNewPassword/"+random+"</a></body></html>");
        // await sendEmail(email,"Verify Email","<html><body><h1>"+random+"</h1></body></html>");
        res.status(200).json({
          status:true,
          message:"email is sent"
        })

      }catch(error){
        return res.status(500).json({status:false,error:error});
      }
    }
    setNewPassword = async(req:Request,res:Response,next:NextFunction)=>{
      const {id,password} = req.body;
      if(!id || !password)
      return res.status(200).json({status:false,message:"Please input parameter correctly"});
      try{
        const cacheObject = await this.redisHandle.getObject(id);
        if(!cacheObject?.email){
          return res.status(200).json({status:false,message:"Invalid hash!"});
        }
        const email = cacheObject.email;
        const userRecord = await UserRepository.readByEmail(email);
        if(!userRecord){
          return res.status(200).json({status:false,message:"There is not user"});
        }
        bcrypt.hash(password, 12).then(async (hash) => {
          userRecord.password = hash;
          await UserRepository.update(userRecord);
          return res.status(200).json({status:true,message:"Updating password is successful!"});
        })
        
      }catch(error){
        return res.status(500).json({status:false,error:error});
      }
      
    }
    signIn = async (req: Request, res: Response, next: NextFunction)=>{
      passport.authenticate('local',{session:false },(err,user,info)=>{
        if(err || !user){
            return res.status(400).json({
                message:'Incorrect username or password',
                status:false
            });
        }
        req.login(user,{session:false},(err)=>{
            if(err) res.send(err);
        })
        
        const token = getToken({jid:user.id});
        // const refreshToken = getRefreshToken({rid:user.id});
        CRedis.getInstance().setObject(user.id!.toString(),{
            refresh_token:token,
            expires:eval(REFRESH_CONFIG.expiry)
         })
        // Set browser httpOnly cookies
        res.cookie("jwt", token, {
            secure: true,
            httpOnly: true,
        });
        
        return res.json({status:true,token});
    })
   (req,res); 
    }
    signUp = async (req: Request, res: Response, next: NextFunction)=>{
      const {email, password} = req.body;
      if(!email || !password)
      {
        res.status(200).json({
          status:false,
          message:"password or email is invalid"
        })
        return;
      }
      const random = generateRandom();
      console.log("random",random)
      try{
        
          await this.redisHandle.setObject(email,{random:random,password:password},1000*60);
          await EmailContent(email,"Verify Email","<html><body><h1>"+random+"</h1></body></html>");
          res.status(200).json({
            status:true,
            message:"email is sent"
          })
          return;
      }catch(error){
          res.status(500).json({
            status:false,
            error:error
          })
      }
      
    }
    createUserRecord = async (
      username:string,
      email:string,
      password:string,
      first_name:string,
      last_name:string,
      city : string ,
      state : string ,
      country : string ,
      image_url : string ,
      account_type_id:number,
      res:Response
      )=>{
      bcrypt.hash(password, 12).then(async (hash) => {
          if(email && password){
            await UserRepository.create({
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
                account_type:account_type_id,
                created_at:new Date()
            } as IUser)
              .then((user) =>
                {
                  const token = getToken({jid:user.id});
                  CRedis.getInstance().setObject(user.id!.toString(),{
                    refresh_token:token,
                    expires:REFRESH_CONFIG.expiry
                 })
                 res.cookie("jwt", token, {
                  secure: false,
                  httpOnly: true
                });
                  // const refreshToken = getRefreshToken({id:user.id});
                  // this.redisHandle.setObject(user.id!.toString(),{
                  //    refresh_token:refreshToken,
                  //    expires:REFRESH_CONFIG.expiry
                  // })
                  // res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
                  res.send({ status: true,token:token});
                }
              )
              .catch((error) =>
                res.status(400).json({
                  message: "User not successful created",
                  error: error.message,
                  status:false
                })
                );
              }
                else {
                  res.status(400).json({
                      message: "User not successful created Invalid data",
                      status:false
                    })
               }
        })
        return;
    }
    backImg = async (req: Request, res: Response, next: NextFunction)=>{
      const action = req.query.img;
      var filePath = path.join(__dirname,"../../../uploads/background",action).split("%20").join(" ");
      // var filePath = path.join(__dirname,"../../uploads/profile",action).split("%20").join(" ");
      console.log("file path",filePath);
      fs.exists(filePath,(exists)=>{
        if(!exists){
          res.writeHead(404,{
            "Content-Type":"text/plain"
          });
          res.end("404 Not Found");
          return;
        }

        var ext = path.extname(action);
        var contentType = "text/plain";
        if(ext === ".png"){
          contentType = "image/png"
        }else if(ext ===".jpg" ||ext ===".jpeg" ){
          contentType = "image/jpeg"
        }
        res.set('Access-Control-Allow-Origin', '*');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
        res.writeHead(200,{
          "Content-Type":contentType,
          "Access-Control-Allow-Origin":"*"
        });
        fs.readFile(filePath,(err,content)=>{
          res.end(content);
        })
      })
    }
    getBackground =  async (req: Request, res: Response, next: NextFunction)=>{
      try{
        const backRecord =await BackgroundRepository.readByAll();
        if(backRecord.length){
          return res.status(200).json({status:true,back:backRecord[0].url});
        }else{
          return res.status(200).json({status:false})
        }
      }catch(error){
        console.log("error",error);
        return res.status(500).json({status:false});
      }
    }
    profile = async (req: Request, res: Response, next: NextFunction)=>{
      res.send(req.user);
    }
    update =  async (req: Request, res: Response, next: NextFunction)=>{
          const {username,email, password,first_name , last_name, city , state , country , image_url , is_admin} = req.body;

          bcrypt.hash(password, 12).then(async (hash) => {
            if(username && email && password && first_name && last_name && city && state && country && is_admin !== undefined && is_admin !==null){
              await UserRepository.create({
                  username:username,
                  email:email,
                  password: hash,
                  first_name:first_name,
                  last_name:last_name,
                  city:city,
                  state:state,
                  country:country,
                  image_url:image_url,
                  is_admin:is_admin,
                  created_at:new Date()
              } as IUser)
                .then((user) =>
                  res.status(200).json({
                    message: "User successfully created",
                     user,
                  })
                )
                .catch((error) =>
                  res.status(400).json({
                    message: "User not successful created",
                    error: error.message,
                  })
                  );
                }
                  else {
                    res.status(400).json({
                        message: "User not successful created Invalid data",
                      })
                 }
              });
            }
    logOut=(req: Request, res: Response, next: NextFunction)=>{
      req.logout(function(err) {
        if (err) { return next(err); }
        res.status(200).json({status:true});
      });

    }
}