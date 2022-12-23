import { NextFunction, Request, Response } from 'express';
// import * as  jwt from 'jsonwebtoken'
import { REFRESH_CONFIG } from '../utils';
import passport from '../utils/passport';
import { getToken,getRefreshToken } from '../utils/refreshToken';
import CRedis from '../utils/redis';

import ProjectRepository from "../repositories/project";
import ProgressRepository from '../repositories/progress';
import AccountTypeRepository from '../repositories/account_type';
import NotificationRepository from '../repositories/notification';
import UsersRepository from "../repositories/users";

import ExtensionRepository from '../repositories/extension';
import { INotification } from '../models/notification';
import { IProgress } from '../models/progress';
import { IAcountType } from 'src/models/account_type';

import BackgroundRepository from '../repositories/background';
import CardRepository from '../repositories/cards';

const path = require("path");
const  fs = require('fs');
export default class AdminController {
    constructor(){

    }
    login = async (req: Request, res: Response, next: NextFunction)=>{
        res.status(200).json({status:true});
    }
    getProfile = async (req: Request, res: Response, next: NextFunction)=>{
      try{
        if(req.user){
            return res.status(200).json({status:true,user:req.user});
        }else{
            return res.status(200).json({status:false});
        }
      }catch(error){
        res.status(500).json({status:false,error:error})
      }
    }
    adminLogin = async (req: Request, res: Response, next: NextFunction)=>{
        passport.authenticate('local', {session: false}, (err, user, info) => {
            if(info){
                return res.status(200).json({
                    message:info.message,
                    status:false
                })
            }
            if (err || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user   : user
                });
            }
            if(!user.is_admin){
                return res.status(200).json({
                    message: 'You are not admin!',
                    status:false
                });
            }
           req.login(user, {session: false}, (err) => {
               if (err) {
                   res.send(err);
               }
               // generate a signed son web token with the contents of user object and return it in the response
               const token = getToken({jid:user.id});
                // const refreshToken = getRefreshToken({rid:user.id});
                CRedis.getInstance().setObject(user.id!.toString(),{
                    refresh_token:token,
                    expires:eval(REFRESH_CONFIG.expiry)
                 })
                // Set browser httpOnly cookies
                res.cookie("jwt", token, {
                    secure: false,
                    httpOnly: true
                });
               return res.json({status:true,token:token});
            });
        })
        (req, res);
    }
   
    dashboard = async (req: Request, res: Response, next: NextFunction)=>{
        try{
            const projects = await ProjectRepository.readAllWithUser();
            // const projectIds = projects.map((item)=>item.id?.toString()!);
           
            // const progress = await ProgressRepository.readAllByGroupWithProjectIds(projectIds)

            const result = projects.map((item)=>{
                return {
                    id:item.id,
                    title:item.title,
                    link:item.link,
                    descripotion:item.description,
                    allocate_budget:item.allocate_budget,
                    budget:item.budget,
                    seted_date:item.seted_date,
                    create_at:item.create_at,
                    publish_at:item.publish_at,
                    total_power:item.total_power,
                    img_url:item.img_url,
                    user_name:item.first_name + " " + item.last_name,
                    city:item.city,
                    state:item.state,
                    country:item.country,
                    total_progress:item.total_progress
                }
            })
            res.status(200).json({status:true,projects:result});
        }catch(error){
            res.status(500).json({status:false,error:error});
        }
        
    }
    setBudget = async (req: Request, res: Response, next: NextFunction)=>{
        const {budget,project_id} = req.body;
        if(!budget || !project_id) {
            res.status(200).json({status:false,message:"Invalid parameter"});
            return;
        }
        const project =await ProjectRepository.readById(project_id);
        if(!project){
            res.status(200).json({status:false,message:"dont exist project"});
            return;
        }
        try{
            if(project.publish_at){//check if it is 2days left 
                let d = new Date();
                var dateOffset = (24*60*60*1000) * 2; //2 days
                d.setTime(d.getTime() - dateOffset);
                if(project.publish_at.getTime()>=d.getTime()){
                    project.budget = budget;
                    project.seted_date = new Date();
                    const updateProject=await ProjectRepository.update(project);
                    res.status(200).json({status:true,project:updateProject});
                    return;
                }else{
                    res.status(200).json({status:false,message:"over editing time"});
                    return;
                }
            }else{
                project.budget = budget;
                project.seted_date = new Date();
                const updateProject=await ProjectRepository.update(project);
                res.status(200).json({status:true,project:updateProject});
                return;
            }
        }catch(error){
            return res.status(500).json({status:false,error:error});
        }
    }
    publishProject=async (req: Request, res: Response, next: NextFunction)=>{
        const {is_publish,project_id} = req.body;
        if(!is_publish || !project_id) {
            res.status(200).json({status:false,message:"Invalid parameter"});
            return;
        }
        const project =await ProjectRepository.readById(project_id);
        if(!project){
            res.status(200).json({status:false,message:"dont exist project"});
            return;
        }
       
        try{
            
            if(is_publish==="true"){ 
                    project.publish_at = new Date();
                    const updateProject=await ProjectRepository.update(project);
                    res.status(200).json({status:true,project:updateProject});
                    return;
            }else{
                const updateProject=await ProjectRepository.updateUnPublish(project);
                res.status(200).json({status:true,project:updateProject});
                return;
            }
        }catch(err){
            res.status(500).json({status:false, error:err}); 
        }

    }
    setExtension = async (req: Request, res: Response, next: NextFunction)=>{
        const {url} = req.body;
        if(!url){
            return res.status(200).json({status:false,message:"Please input url correctly"});
        }
        try{
            const record = await ExtensionRepository.read();
            if(!record){
                await ExtensionRepository.create(url);
                return res.status(200).json({status:true,message:"Createing url is successful"});
            }
            record.url = url;
            await ExtensionRepository.update(record);
            return res.status(200).json({status:true,message:"Updating url is successful"});
        }catch(error){
            return res.status(500).json({status:false,error:error});
        }
    } 
    getExtension = async (req: Request, res: Response, next: NextFunction)=>{
        try{
            const extenRecord = await ExtensionRepository.read();
            if(!extenRecord){
                return res.status(200).json({status:false,message:"There is no url. please register url"});
            }
            const url =extenRecord.url;
            return res.status(200).json({status:true,url:url});
        }catch(err){
            return res.status(500).json({status:false,error:err});
        }
    } 
    delProject = async (req: Request, res: Response, next: NextFunction)=>{
        const {project_id} = req.body;
        if(!project_id){
            res.status(200).json({status:false,message:"There is no project id"});
            return;
        }
        try{
            const project = await ProjectRepository.readById(project_id);
            if(!project){
                res.status(200).json({status:false,message:"There is no project"});
                return;
            }
            await  ProjectRepository.remove(project_id);
            return res.status(200).json({status:true});
        }catch(error){
            console.log("error",error);
            res.status(500).json({status:false,error:error});
        }
        
    }
    // updateProject =async (req: Request, res: Response, next: NextFunction)=>{
    //     const {project_id} = req.body;
    //     if(!project_id) {
    //         res.status(200).json({status:false, message:"invalid project id"});
    //     }
        
    //     const project =await ProjectRepository.readById(project_id);
    //     if(!project){
    //         res.status(200).json({status:false,message:"dont exist project"});
    //     }

    // }
    progressProject = async (req: Request, res: Response, next: NextFunction)=>{
            const {project_id,allocateBudget} = req.body;
            
            if(!project_id || !allocateBudget){
                res.status(200).json({status:false,message:"invalid params"});
                return;
            }
            
            try{
                const project =await ProjectRepository.readById(project_id);
                if(!project){
                    res.status(200).json({status:false,message:"dont exist project"});
                    return;
                }
                if(!project.allocate_budget)project.allocate_budget=0;
                project.allocate_budget += parseInt(allocateBudget);
                await ProjectRepository.update(project);

                // const latestRecord = await ProgressRepository.readLatestRecordByProjectID(project.id!);            
                // let totalProgress:number;
                // console.log("latestRecord",latestRecord);
                // if(latestRecord){
                //     totalProgress = latestRecord!.total_progress*1+allocateBudget*1;
                // }else{
                //     totalProgress = progress_budget*1;
                // }
                // const progressData = ProgressRepository.makeProgressData(project_id,progress_budget,totalProgress,new Date());
                
                // const progress_data=await ProgressRepository.create(progressData as IProgress);
                res.status(200).json({status:true,allocateBudget:allocateBudget});
                return;
            }catch(error){
                console.log("error",error)
                res.status(500).json({status:false,error:error});
            }
    }
    
    notification = async (req: Request, res: Response, next: NextFunction)=>{
        try{
            const notificaton = await NotificationRepository.readAll();
            return res.status(200).json({status:true,notification:notificaton});
        }catch(error){
            res.status(500).json({status:false,error:error});
            return;
        }

    }

    removeNotification = async (req:Request, res:Response,next:NextFunction)=>{
        const {id} = req.body;
        console.log("id",id)
        if(!id){
            res.status(200).json({status:false,message:"Invalid Record"});
            return;
        }
        const record = await NotificationRepository.remove(id);
        res.status(200).json({status:true,record:record})
        return;
    }

    getAccountType = async (req: Request, res: Response, next: NextFunction)=>{
        try{
            const AccountRecords =await AccountTypeRepository.readAll();
            return res.status(200).json({status:true,accounts:AccountRecords});
        }catch(error){
            return res.status(500).json({status:false,error:error});
            
        }
    }
    
    setNofitication = async (req: Request, res: Response, next: NextFunction)=>{
            const {text,link,category} = req.body;
            if(!text || !category){
                res.status(200).json({status:false,message:"Invalid Data"});
                return;
            }
            try{    
                const notiData = NotificationRepository.makeNotificationData(text,link,category,new Date());
                const createRecord=await NotificationRepository.create(notiData as INotification);
                res.status(200).json({status:true,record:createRecord,message:"Saving notification is successfull"});
                return;
            }catch(err){
                res.status(500).json({status:false,error:err});
            }        
    }
    
    createAccount = async (req: Request, res: Response, next: NextFunction) =>{
        const {name,max_count,level} = req.body;
        if(!name || !max_count || !level){
            return res.status(200).json({status:false,message:"invalid parameters"});
        }
        try{
            const accountTypeData = AccountTypeRepository.makeAccountTypeData(name,max_count,level);
            const createAccount =await AccountTypeRepository.create(accountTypeData as IAcountType);
            console.log("create Accoount",createAccount);
            return res.status(200).json({status:true,account:createAccount});
        }catch(error){
            return res. status(500).json({status:false,error:error});
        }
    }

    updateAccount = async (req: Request, res: Response, next: NextFunction) =>{
        const {id,name,max_count,level} = req.body;
        if(!id||!name || !max_count || !level){
            return res.status(200).json({status:false,message:"invalid parameters"});
        }
        try{
            const updateAccount = await AccountTypeRepository.readById(id);
            if(!updateAccount){
                return res.status(200).json({status:false,message:"There is no record to update"});
            }
            updateAccount.name = name;
            updateAccount.max_count = max_count;
            updateAccount.level = level;
            const updatedAccount = await AccountTypeRepository.update(updateAccount);
            return res.status(200).json({status:true,record:updatedAccount}); 
        }catch(error){
            return res. status(500).json({status:false,error:error});
        }
    }

    deleteAccount = async (req: Request, res: Response, next: NextFunction) =>{
        const {id} = req.body;
        if(!id){
            return res.status(200).json({status:false,message:"Invalid Parametes"});
        }
        try{
            const deleteAccount = await AccountTypeRepository.remove(id);
            return res.status(200).json({status:true,id:deleteAccount});
        }catch(error){
            return res.status(500).json({status:false,error:error});
        }
    }
    saveBack = async (req:Request,res:Response, next:NextFunction) =>{
        try{
            const img_url = req['file'].filename;
            if(!img_url){
                return res.status(200).json({status:false,message:"There are no background file"})
            }
            const records = await BackgroundRepository.readByAll();
            console.log("records",records.length);
            if(records.length){
                let backRecord=records[0];
                backRecord.url = img_url;
                await BackgroundRepository.update(backRecord);
                return res.status(200).json({status:true,message:"Uploading background is successful"});
            }else{
                const backData = BackgroundRepository.makebackgroundData(img_url);
                await BackgroundRepository.create(backData);
                return res.status(200).json({status:true,message:"Uploading background is successful"});
            }
        }catch(error){

        }
    }
    getUsers = async (req: Request, res: Response, next: NextFunction) =>{
        try{
            const users =await UsersRepository.readAllUserWithAccountType();
            return res.status(200).json({status:true,users:users});
        }catch(error){
            return res.status(500).json({status:false,error:error});
        }
    }
    
    saveLink = async (req: Request, res: Response, next: NextFunction) =>{
        const {project_id,link} = req.body;
        if(!project_id || !link){
            return res.status(200).json({status:false,message:"please input input parameter correctly!"});
        }
        try{
            const project =await ProjectRepository.readById(project_id);
            if(!project){
                res.status(200).json({status:false,message:"There is no cur project"});
                return;
            }
            project.link = link;
            await ProjectRepository.update(project);
            return res.status(200).json({status:true,message:"Updating link is successful!"});
        }catch(error){
            return res.status(500).json({status:false,error:error});
        }
    }
    getCardList = async (req: Request, res: Response, next: NextFunction) =>{
        try{
            const cardList = await CardRepository.readAll();
            return res.status(200).json({status:true,list:cardList});
        }catch(error){
            console.log("error",error);
            return res.status(500).json({status:false,error:error});
        }
    } 
    createCard = async (req: Request, res: Response, next: NextFunction) =>{
        const {id,title,srcStory,link,summary} = req.body;
        const file_name = req['file'].filename;
        if(!title || !srcStory || !link || !summary ){
            res.status(200).json({status:false,message:"Invalid parameters"});
            return;
        }
        try{
            if(id === "0"){
                const data = CardRepository.makeCardData(title,summary,srcStory,link,file_name,new Date());
                const record = await CardRepository.create(data);
                return res.status(200).json({status:true,message:"Creating card is Success"});
            }else{
                const cardRecord = await CardRepository.readById(id);
                if(!cardRecord){
                    return res.status(200).json({status:false,message:"There is no card"});
                }
                const updateData = {
                    ...cardRecord,
                    title,
                    srcStory,
                    summary,
                    source:srcStory,
                    link,
                    img_url:file_name
                }
                await CardRepository.update(updateData);
                return res.status(200).json({status:true});
            }
        }catch(error){
            return res.status(500).json({status:false,error:error});
        }

    }
    updateCard = async (req: Request, res: Response, next: NextFunction) =>{
        const {id,title,summary,link,srcStory}=req.body;
        
        if(id ==="0"){
            return res.status(200).json({status:false,message:"Invalid id"});
        }
        try{
            const cardRecord = await CardRepository.readById(id);
            if(!cardRecord){
                return res.status(200).json({status:false,message:"There is no card"});
            }
            const data = {
                ...cardRecord,
                title,
                summary,
                link,
                source:srcStory
            }
            await CardRepository.update(data); 
            return res.status(200).json({status:true,message:"successful"});
        }catch(error){
            return res.status(500).json({status:false,error:error});
        }
    }
    getCard = async (req: Request, res: Response, next: NextFunction) =>{
        const {id} = req.body;
        if(!id || id==="0"){
            return res.status(200).json({status:false,message:"Invalid Id"});
        }
        try{
            const cardRecord = await CardRepository.readById(id);
            if(!cardRecord){
                return res.status(200).json({status:false,message:"There is no card"});
            }
            return res.status(200).json({status:true,record:cardRecord});
        }catch(err){
            return res.status(500).json({status:false,error:err})
        }
    }
    delCard =  async (req: Request, res: Response, next: NextFunction) =>{
            const {id} = req.body;
            
            if(!id  || id==="0"){
                return res.status(200).json({status:false,message:"Invalid Id"});
            }       
            try{
                await CardRepository.remove(id);
                return res.status(200).json({status:true});
            }catch(err){
                return res.status(500).json({status:false, error:err});
            }
    }
    cardImg = async (req: Request, res: Response, next: NextFunction) =>{
        const action = req.query.img;
      var filePath = path.join(__dirname,"../../../uploads/cards",action).split("%20").join(" ");
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
        }else if(ext ===".jpg"){
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
}