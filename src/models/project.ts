import { RowDataPacket }  from "mysql2";

export interface IProjects extends RowDataPacket {
    id?: number
    title:string
    description:string
    budget:number  // user suggest this budget
    owner_id:number //user id
    allocate_budget:number //admin set this budget
    total_power:number
    img_url:string
    link:string //link for videos
    city:string
    state:string
    country:string
    seted_date:Date | null //when admin set budget
    create_at : Date   
    publish_at : Date | null // when project is published
}
