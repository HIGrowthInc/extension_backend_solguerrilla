
import { ISocket } from "./types";
import { WebSocket } from "ws";
import { uuidv4 } from "./utils";
export default class SocketList{
    socketList:Array<ISocket>;
    sockHash = new Map<WebSocket,number>();
    constructor(){
        this.socketList=[];
    }
    addUser(user_id:number,socket:WebSocket){
        
        const exist =this.existingUser({user_id,socket});
        if(exist){
            return { error: "User is taken"};
        }
        const user = {user_id,socket} as ISocket;
        this.socketList.push({user_id,socket}); 
        this.sockHash.set(socket,user_id);
        return {user} 
    }

    removeUser(socket:WebSocket):ISocket | undefined{
        const user_id = this.sockHash.get(socket);
        
        const index= this.socketList.findIndex((user)=>{
          return user.user_id === user_id;
        })
        if(index!==1){
        console.log("index----------",index)

            this.sockHash.delete(socket)
            return this.socketList.splice(index,1)[0];
        }
    }
    getUser(user_id:number):ISocket | undefined{
       return this.socketList.find((user)=>user.user_id===user_id)
    }
  
    existingUser (user:ISocket):ISocket | undefined{
        return this.socketList.find(item=>{
           return item.user_id === user.user_id
        })
    }

}