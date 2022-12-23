import * as WebSocket from 'ws';
import {Server,WebSocket as SockClient} from 'ws';
import SocketList from './socketList';
import {Server as HttpServer} from "http";

// import {Server as HttpServer} from "https"; 
import { ISocket } from './types';
import { PARKET_TYPE } from './types';
import NotificationController from '../controllers/notificationController';
import UserRepository from '../repositories/users';
import SupportRepository from '../repositories/support_project';
import ProjectRepository from '../repositories/project';
export default class ServerSocket  {
    socketlists = new SocketList();
    serverSock:Server;
    notification:NotificationController
    constructor(httpServer:HttpServer){
       this.serverSock = new Server({server:httpServer});
       this.notification = new NotificationController();
       this.listen();
    }
    sendNotificatonForUser = async (user_id:number)=>{

    }
    sendNotificationForAllUser = async ()=>{
        try{
            const notDataForAllUser = await this.notification.getNotificationForAllUser();
            if(notDataForAllUser){
                this.socketlists.socketList.map(item=>{
                    this.sendMessage(item.socket,{type:"all_note",content:{status:true,notification:notDataForAllUser}});
                })

            }
        }catch(error){
            console.log("send NotificationFor All User Error",error);
        }
    }
    async lifTime (user_id:number){
        try{
            let total_power=0;
            let cur_power = 0;
            const date = new Date();
            const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            const totalSupportRecords =await ProjectRepository.readSupportTillTime(user_id,new Date()); 
             totalSupportRecords.map((item)=>{
                total_power += item.total_power;
            })
            const curPowers = await ProjectRepository.readSupportBetweenTime(user_id,firstDay,new Date());
            curPowers.map((item)=>{
                cur_power += item.total_power;
            })
            console.log("total power lis",total_power,cur_power);
            return {total_power:total_power,cur_power:cur_power};
           
        }catch(error){
            console.log("lift time error",error);
        }
    }
    async sendNotificatonforUser(user_id:number){
        try{
            const growMembers = await this.notification.getConnNotification(user_id);
            const supportReachedProject = await this.notification.getSupportReachNotification(user_id);
            const inviteNotification = await this.notification.getInviteforUser(user_id);
            const liftTime = await this.lifTime(user_id);
            const result = {
                status:true,
                grow_mem_week:growMembers,
                supportReachedPorjects:supportReachedProject.reached,
                supportProjects:supportReachedProject.support_projects,
                accept_note:inviteNotification.accept_note,
                joind_note:inviteNotification.joind_note,
                network_note:inviteNotification.network_note,
                upgrade_note:inviteNotification.upgrade_note,
                grow_members:inviteNotification.grow_members,
                life_time:liftTime,
                total_members:inviteNotification.total_members
            }
            const socket = this.socketlists.getUser(user_id);
            if(socket){
                this.sendMessage(socket.socket,{type:"for_user",content:result});
                return;
            }
        }catch(error){
            console.log("sendNotification for user error:",error);
        }
        
    }
    async parseParket(parket:string,socket:WebSocket){
        const jsonData  = JSON.parse(parket);
        const type = jsonData.type;
   
        switch(type){
        case PARKET_TYPE.INIT:
            
            const user_email = jsonData.content?.email;
            if(user_email ==="") return;
            const user_record  =  await UserRepository.readByEmail(user_email); 
            if(!user_record)return;
            const user_id = user_record.id
           
            this.socketlists.addUser(user_id!,socket);
            this.sendNotificationForAllUser();
            this.sendNotificatonforUser(user_id!);
           
        break;
        default:
            ;
        }
  }
  sendMessage(socket:WebSocket,jsonData:any){
    socket.send(JSON.stringify(jsonData));
  }
    listen(){
        console.log("socket initialize")
        this.serverSock.on('connection',(socket)=>{
            socket.send(JSON.stringify({
                type: "init",
                content: [ 1, "2" ]
              }));
            // receive a message from the client
            socket.on("message", (data:string) => {
                // console.log("message",data)
                try{
                     this.parseParket(data,socket);
                }catch(error:any){
                    console.log("error",error)
                    // socket.send(error.status.toString());
                }
            });   
            socket.on("close",()=>{
                this.socketlists.removeUser(socket);
                console.log("close---------",this.socketlists.socketList.length);
            }) 
        });   
       

    }
}
