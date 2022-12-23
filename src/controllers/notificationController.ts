import ConnectRepository from "../repositories/connection";
import ServerSocket from "src/socket";
import NotificationRepository from "../repositories/notification";
import SupportProjectsRepository from "../repositories/support_project";
import ProgressRepository from "../repositories/progress";
import InviteRepository from "../repositories/invite";
import ConnectionRepository from "../repositories/connection";
import UpgradeRepository from "../repositories/upgrade";
export default class NotificationController{
    constructor() {

    }
    getNotificationForAllUser = async ()=>{
        try{
            const now = new Date();
            const before_week = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
            const notificationData = await NotificationRepository.readNotification(before_week,now);
            return notificationData;
        }catch(error){
            console.log("error",error); 
            return null;
        }
    }
    getConnNotification = async (user_id:number)=>{
        const now = new Date();
        const before_week = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        const recordOfthisMonth = await ConnectionRepository.readMaxTotalMember(user_id,before_week,now);
        let grow_members;
        if(!recordOfthisMonth){
            grow_members=0;
        }else{
            grow_members = recordOfthisMonth.max_member - recordOfthisMonth.min_member;
        }
        return grow_members;
    }
    getSupportReachNotification = async (user_id:number)=>{
        const now = new Date();
        const before_week = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        const support_projects =await SupportProjectsRepository.readSupportProjectFull(user_id);
        const project_ids = support_projects.map((item)=>{
            return item.project_id.toString()
        })
        const projectSupported = await ProgressRepository.readAllReachedByGroupWithProjectIds(project_ids);
        return {
            reached:projectSupported,
            support_projects:support_projects
        };
    }
   
    getInviteforUser = async (user_id:number)=>{
        const now = new Date();
        const before_week = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        const accept_records = await InviteRepository.readAcceptRecords(user_id,before_week,now);
        const joind_records = await InviteRepository.readJoinRecords(user_id,before_week,now);
        const connection_records = await ConnectionRepository.readWithUserNotification(user_id,before_week,now);
        const upgrade_record = await UpgradeRepository.readLatestRecrodByDate(user_id);
        const curTime = new Date();
        const lastDayofMonth = new Date(curTime.getFullYear(),curTime.getMonth()+1,0);
        const firstDayofbeforeMonth = new Date(curTime.getFullYear(),curTime.getMonth(),1);
        const total_members_records = await ConnectRepository.readLatestConnectionByUserId(user_id);
        const total_members = total_members_records?.total_member?total_members_records?.total_member:0;
        const recordOfthisMonth = await ConnectionRepository.readMaxTotalMember(user_id,firstDayofbeforeMonth,lastDayofMonth);
        let grow_members;
        if(!recordOfthisMonth){
            grow_members=0;
        }else{
            grow_members = recordOfthisMonth.max_member - recordOfthisMonth.min_member;
        }
        return {
            accept_note:accept_records,
            joind_note:joind_records,
            network_note:connection_records,
            upgrade_note:upgrade_record,
            grow_members:grow_members,
            total_members:total_members
        }
    }
    getNotificationForUser = async (user_id:number)=>{

    }
    
}