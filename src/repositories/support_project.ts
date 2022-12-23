import { ISupportPorject } from "src/models/support_project";
import * as mysql from "mysql2";
import { OkPacket } from "mysql2"
import DB from '../DB';
class SupportProjectRepository {
    connection:mysql.Connection;
    constructor(connection:any) {
        this.connection = connection
    }
    readAll(): Promise<ISupportPorject[]> {
        return new Promise((resolve, reject) => {      
            this.connection?.query<ISupportPorject[]>("SELECT * FROM support_project", (err, res) => {
            if (err) reject(err)
                else resolve(res)
              })
            })
          
    }
    readSupportPorjectByUserIdANDProjectId(user_id:number,project_id:number):Promise<ISupportPorject[]> {
      return new Promise((resolve, reject) => {      
          this.connection?.query<ISupportPorject[]>("SELECT * FROM support_project WHERE user_id = ? AND project_id =?",[user_id,project_id], (err, res) => {
          if (err) reject(err)
              else resolve(res)
            })
          })
        
  }
  readSupportProjectFull(user_id:number):Promise<ISupportPorject[]> {
    return new Promise((resolve, reject) => {      
        this.connection?.query<ISupportPorject[]>("SELECT projects.title,support_project.project_id,projects.description,projects.budget,projects.allocate_budget,projects.allocate_budget,total_power,projects.img_url,users.first_name,users.last_name,users.email ,users.image_url FROM support_project LEFT JOIN projects ON project_id = projects.id LEFT JOIN users ON support_project.user_id = users.id WHERE user_id =?",[user_id], (err, res) => {
        if (err) reject(err)
            else resolve(res)
          })
        })
      
}
    readSupportProject(user_id:number):Promise<ISupportPorject[]> {
      return new Promise((resolve, reject) => {      
          this.connection?.query<ISupportPorject[]>("SELECT * FROM support_project WHERE user_id = ?   GROUP BY project_id  ",[user_id], (err, res) => {
          if (err) reject(err)
              else resolve(res)
            })
          })
        
  }
  readSupportCountProject():Promise<ISupportPorject[]> {
    return new Promise((resolve, reject) => {      
        this.connection?.query<ISupportPorject[]>("SELECT project_id,COUNT(project_id) as cnt FROM support_project GROUP BY project_id", (err, res) => {
        if (err) reject(err)
            else resolve(res)
          })
        })
      
}
    readLatestRecrodByDate (project_id:number): Promise<ISupportPorject | undefined>{
      return new Promise((resolve, reject) => {
        this.connection?.query<ISupportPorject[]>(
          "SELECT * FROM support_project WHERE project_id = ? ORDER BY create_at desc",
          [project_id],
          (err, res) => {
            if (err) reject(err)
            else resolve(res?.[0])
          }
        )
      })
    }
    readById(project_id: number): Promise<ISupportPorject | undefined> {
        return new Promise((resolve, reject) => {
          this.connection?.query<ISupportPorject[]>(
            "SELECT * FROM support_project WHERE id = ?",
            [project_id],
            (err, res) => {
              if (err) reject(err)
              else resolve(res?.[0])
            }
          )
        })
    }
    create(record: ISupportPorject): Promise<ISupportPorject> {
        return new Promise((resolve, reject) => {
          this.connection.query<OkPacket>(
            "INSERT INTO support_project (project_id,user_id,total_support,create_at) VALUES(?,?,?,?)",
            [record.project_id,record.user_id,record.total_support,record.create_at],
            (err, res) => {
              if (err) reject(err)
              else
                this.readById(res.insertId)
                  .then(user => resolve(user!))
                  .catch(reject)
            }
          )
        })
    }
    update(record: ISupportPorject): Promise<ISupportPorject | undefined> {
        return new Promise((resolve, reject) => {
          this.connection.query<OkPacket>(
            "UPDATE support_project SET project_id = ?,user_id = ?,total_support =? WHERE id = ?",
            [record.project_id,record.user_id,record.total_support,record.id],
            (err, res) => {
              if (err) reject(err)
              else
                this.readById(record.id!)
                  .then(resolve)
                  .catch(reject)
            }
          )
        })
    }
    remove(record_id: number): Promise<number> {
        return new Promise((resolve, reject) => {
          this.connection.query<OkPacket>(
            "DELETE FROM support_project WHERE id = ?",
            [record_id],
            (err, res) => {
              if (err) reject(err)
              else resolve(res.affectedRows)
            }
          )
        })
    }
    makeSupportProjectData (project_id:number,user_id:number,total_support:number,create_at:Date){
        return ({
            project_id,user_id,total_support,create_at
        });
    }
}
export default new SupportProjectRepository(DB.getInstance().connection);