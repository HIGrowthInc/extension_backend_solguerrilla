import { RowDataPacket }  from "mysql2";

export interface IAcountType extends RowDataPacket {
    id?: number
    name:string
    level:number
    max_count:number
}
