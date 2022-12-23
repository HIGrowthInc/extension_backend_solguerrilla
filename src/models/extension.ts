import { RowDataPacket }  from "mysql2";


export interface IExtension extends RowDataPacket {
    id?: number
    url:string
  }
