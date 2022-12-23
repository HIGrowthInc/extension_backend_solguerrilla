import { RowDataPacket }  from "mysql2";


export interface IConnection extends RowDataPacket {
    id?: number
    user_id:number
    total_member: number
    follow_id: number
    create_at: Date
  }
