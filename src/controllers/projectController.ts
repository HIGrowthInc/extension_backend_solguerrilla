import { NextFunction, Request, Response } from 'express';
import SupportProjectRepository from '../repositories/support_project';
import { IProjects } from '../models/project';

import ProjectRepository from '../repositories/project';
import { ISupportPorject } from '../models/support_project';
import project from '../repositories/project';
import UsersRepository from '../repositories/users';
import ProgressRepository from '../repositories/progress';
import { transformFunctionListItemReply } from '@redis/client/dist/lib/commands/generic-transformers';
const path = require("path");
const  fs = require('fs');
export default class ProjectController {
    constructor(){

    }
    getProject = async (req:Request, res:Response,next:NextFunction)=>{
        const { id }= req.query;
        if(!id){
            res.status(200).json({status:false,message:"id params is invalid"})
            return;
        }
        try{
            console.log("id",id);
            const projectRecord = await ProjectRepository.readAllWithUserById(parseInt(id.toString()));
            if(!projectRecord.length){
                res.status(200).json({status:false,message:"no project"});
                return;
            }
            const left_days=this.calculateIsAllocatedPermission(projectRecord[0].publish_at!);
            const progress = await ProgressRepository.readLatestRecordByProjectID(projectRecord[0].id!);
            console.log("progress",progress);
            let total_progress;
            const result = {
                title:projectRecord[0].title,
                description:projectRecord[0].description,
                budget:projectRecord[0].budget,
                link:projectRecord[0].link,
                allocate_budget:projectRecord[0].allocate_budget,
                total_power:projectRecord[0].total_power,
                project_image:projectRecord[0].img_url,
                publish_at:projectRecord[0].publish_at,
                seted_date:projectRecord[0].seted_date,
                user_name:projectRecord[0].first_name + " " + projectRecord[0].last_name,
                user_img:projectRecord[0].image_url,
                email:projectRecord[0].email,
                state:projectRecord[0].state,
                country:projectRecord[0].country,
                city:projectRecord[0].city,
                total_progress:progress?.total_progress?progress?.total_progress:0,
                isAllocate:left_days<=2?true:false
            }
            res.status(200).json({status:true,detail:result});
        } catch(error){
            res.status(500).json({status:false,error:error});
        }     
    }
    getProjectsForAny = async (req: Request, res: Response, next: NextFunction) =>{
        try{
            const records =await  ProjectRepository.readAllWithUserForAny();
            const supportCountRecord = await SupportProjectRepository.readSupportCountProject();
            return res.status(200).json({status:true,records:records,support:supportCountRecord});
        }catch(error){
            res.status(500).json({status:false,error:error});
        }

    }
    getProjects = async (req: Request, res: Response, next: NextFunction)=>{
        const {email} = req.body;
        console.log("email",email);
        if(!email)
        {
            res.status(200).json({status:false,message:"There are not this email"});
            return;
        }
        const userRecord = await UsersRepository.readByEmail(email);
        if(!userRecord){
            res.status(200).json({status:false,message:"There is no user in this site"});
            return;
        }
        const user_id = userRecord.id;
        try{
            const projects = await ProjectRepository.readAllWithUserForAny();
            const projectIds = projects.map((item)=>item.id?.toString()!);
            const supportProjectsByUser = await SupportProjectRepository.readSupportProject(user_id!);
            const progress = await ProgressRepository.readAllByGroupWithProjectIds(projectIds);
            const supportCountRecord = await SupportProjectRepository.readSupportCountProject();
            res.status(200).json({status:true,projects:projects,support:supportProjectsByUser,progress:progress,countRecord:supportCountRecord});
            return;
        }catch(error){      
            console.log("error",error);
            res.status(500).json({status:false,error:error});
        }
        
    }
   
    submitProject=async (req: Request, res: Response, next: NextFunction)=>{
        const {title,description,budget,total_power,city,state,country,link} = req.body;
        const img_url = req['file'].filename;
        if(!title || !description || !budget || !total_power || !city || !country ||!state || !link) return;
        if(!req.user || !req?.user['id']) return;
        const projectData = ProjectRepository.makeProjectsData(title,description,budget,req.user['id'],0,total_power,state,country,city,img_url,null,new Date(),null,link);
        try{
            const project= await ProjectRepository.create(projectData as IProjects);
            res.status(200).json({status:true,project:project,message:"submit project successful!"});
        }catch(error){
            res.status(500).json({status:false,error:error})
        }
    }

    support = async (req: Request, res: Response, next: NextFunction)=>{
        const {project_id} = req.body;
        if(!project_id) return;
        if(!req.user || !req?.user["id"]) return;
        const user_id = req?.user["id"];
        try{
            const supportRecord = await SupportProjectRepository.readSupportPorjectByUserIdANDProjectId(user_id,project_id);
            if(supportRecord.length>0){
               
                await supportRecord.map(async (item)=>{
                    await SupportProjectRepository.remove(item.id!);
                })
                return res.status(200).json({status:true,isSupport:false});
            }else{
                const totalSupport = await this.calTotalsupportForProject(project_id)
                const supportData = SupportProjectRepository.makeSupportProjectData(project_id,user_id,totalSupport,new Date());
                await SupportProjectRepository.create(supportData as ISupportPorject);
                res.status(200).json({status:true,isSupport:true});
            }
           
        }catch(error){
            res.status(500).json({status:false,error:error});
        }

    }
    getProjectImg =  async (req: Request, res: Response, next: NextFunction)=>{
        try{
            const action = req.query.img;

            // var filePath = path.join(__dirname,"../../uploads/project",action).split("%20").join(" ");
            var filePath = path.join(__dirname,"../../../uploads/project",action).split("%20").join(" ");
            
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
                }else if(ext ==="jpg" || ext ===".jpeg" ){
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
        }catch(error){
            res.status(500).json({status:false,error:error});
        }
    }
    calTotalsupportForProject =async (project_id:number)=>{
        const latestRecord = await SupportProjectRepository.readLatestRecrodByDate(project_id);
        if(latestRecord){
            return latestRecord.total_support+1;
        }else{
            return 1;
        }
    }
    calculateIsAllocatedPermission =  (publish_date:Date |null):number=>{
        if(!publish_date)
        {
            return 0;
        }
        const publi_date = new Date(publish_date);
        const set_date_now = new Date();
        let difference = set_date_now.getTime() - publi_date.getTime();
        let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
        return TotalDays;
    }   
}