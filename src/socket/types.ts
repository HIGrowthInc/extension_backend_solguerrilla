import { WebSocket } from "ws";
export  enum PARKET_TYPE {
    INIT = "init",
}

export type ISocket ={
    user_id:number;
    socket:WebSocket;
}
export type ISocketData ={
    type:PARKET_TYPE;
    data:any
}