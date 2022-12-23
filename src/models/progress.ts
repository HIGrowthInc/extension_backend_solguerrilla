import { RowDataPacket }  from "mysql2";

export interface IProgress extends RowDataPacket {
    id?: number
    project_id:number
    budget:number   //admin set this budget that is amount of adding
    total_progress:number //total amount of pregressing project
    create_at:Date
}
