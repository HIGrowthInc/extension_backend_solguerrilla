import { RowDataPacket }  from "mysql2";


export interface IUpgrade extends RowDataPacket {
    id?: number
    user_id:number
    to_level_id: number
    create_at: Date
  }
