import { RowDataPacket }  from "mysql2";


export interface INotification extends RowDataPacket {
    id?: number
    link:string | null
    text: string
    category: number  //0 general 1 climate
    create_at: Date
  }
