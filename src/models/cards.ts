import { RowDataPacket }  from "mysql2";

export interface ICardType extends RowDataPacket {
    id?: number
    title:string
    summary:string
    source:string | null
    link:string | null
    img_url : string | null
    create_at : Date | null
}
