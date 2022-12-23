import { RowDataPacket }  from "mysql2";


export interface IInvite extends RowDataPacket {
    id?: number
    user_id:number
    email: string
    is_accept: number
    is_joined: number
    hash:string
    accept_at:Date | null
    create_at: Date
    joind_at:Date | null
  }
