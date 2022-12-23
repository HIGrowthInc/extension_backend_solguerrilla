import { RowDataPacket }  from "mysql2";

export interface IUser extends RowDataPacket {
    id?: number
    username:string
    email: string
    password: string
    is_admin: number
    first_name:string
    last_name:string
    city:string
    state:string
    country:string
    image_url:string
    is_init:number
    account_type:number
    created_at: Date
  }
