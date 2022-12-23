import { RowDataPacket }  from "mysql2";

export interface ISupportPorject extends RowDataPacket {
    id?: number
    project_id:number
    user_id:number
    total_support:number //count of memebers supporting this project
    create_at: Date
}
