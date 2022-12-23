import { RowDataPacket }  from "mysql2";

export interface IBackground extends RowDataPacket {
    id?: number
    url:string;
}
