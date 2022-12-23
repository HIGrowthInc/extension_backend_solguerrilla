import { IProgress } from "src/models/progress";
import * as mysql from "mysql2";
import { OkPacket } from "mysql2"
import DB from '../DB';
class ProgressRepository {
    connection:mysql.Connection;
    constructor(connection:any) {
        this.connection = connection
    }
    whereIn(column:string,value:Array<string>):string{
        let result=[""];
        result=value.map((item,index)=>column +" = "+item + " or")
        let sResult = result.join(" ");
        const lastIndex  =sResult.lastIndexOf("or");
        return sResult.slice(0,lastIndex-1);
    }
    readLatestRecordById(project_id: number): Promise<IProgress | undefined> {
      return new Promise((resolve, reject) => {
        this.connection?.query<IProgress[]>(
          "SELECT * FROM progress WHERE id = ? ORDER BY create_at desc",
          [project_id],
          (err, res) => {
            if (err) reject(err)
            else resolve(res?.[0])
          }
        )
      })
  }
    readAll(): Promise<IProgress[]> {
        return new Promise((resolve, reject) => {      
            this.connection?.query<IProgress[]>("SELECT * FROM progress", (err, res) => {
            if (err) reject(err)
                else resolve(res)
              })
            })
          
    }
    readAllReachedByGroupWithProjectIds(ids:Array<string>): Promise<IProgress[]> {
      const whereState = this.whereIn("project_id",ids);
      // console.log("SELECT * FROM progress Group By project_id WHERE "+whereState);
      const statement = ids.length?"WHERE "+whereState:"";
      return new Promise((resolve, reject) => {      
          this.connection?.query<IProgress[]>("SELECT projects.title FROM projects WHERE id=ANY(SELECT project_id  FROM progress "+statement+"  Group By project_id  HAVING MAX(budget) <MAX(total_progress))", (err, res) => {
          if (err) reject(err)
              else resolve(res)
            })
          })
        
  }
    readAllByGroupWithProjectIds(ids:Array<string>): Promise<IProgress[]> {
      const whereState = this.whereIn("project_id",ids);
      // console.log("SELECT * FROM progress Group By project_id WHERE "+whereState);
      return new Promise((resolve, reject) => {      
          this.connection?.query<IProgress[]>("SELECT * FROM progress WHERE "+whereState+" Group By project_id  ", (err, res) => {
          if (err) reject(err)
              else resolve(res)
            })
          })
        
  }
    readLatestRecordByProjectID(project_id:number): Promise<IProgress | undefined> {
      return new Promise((resolve, reject) => {
        this.connection?.query<IProgress[]>(
          "SELECT * FROM progress WHERE project_id = ? ORDER BY create_at desc",
          [project_id],
          (err, res) => {
            if (err) reject(err)
            else resolve(res?.[0])
          }
        )
      })
    }
    readById(progress_id: number): Promise<IProgress | undefined> {
        return new Promise((resolve, reject) => {
          this.connection?.query<IProgress[]>(
            "SELECT * FROM progress WHERE id = ?",
            [progress_id],
            (err, res) => {
              if (err) reject(err)
              else resolve(res?.[0])
            }
          )
        })
    }
    create(progress: IProgress): Promise<IProgress> {
        return new Promise((resolve, reject) => {
          this.connection.query<OkPacket>(
            "INSERT INTO progress (project_id,budget,total_progress,create_at) VALUES(?,?,?,?)",
            [progress.project_id,progress.budget,progress.total_progress,progress.create_at],
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
    update(progress: IProgress): Promise<IProgress | undefined> {
        return new Promise((resolve, reject) => {
          this.connection.query<OkPacket>(
            "UPDATE progress SET project_id = ?,budget = ?,total_progress = ? WHERE id = ?",
            [progress.project_id,progress.budget,progress.total_progress,progress.id],
            (err, res) => {
              if (err) reject(err)
              else
                this.readById(progress.id!)
                  .then(resolve)
                  .catch(reject)
            }
          )
        })
    }
    remove(progress_id: number): Promise<number> {
        return new Promise((resolve, reject) => {
          this.connection.query<OkPacket>(
            "DELETE FROM progress WHERE id = ?",
            [progress_id],
            (err, res) => {
              if (err) reject(err)
              else resolve(res.affectedRows)
            }
          )
        })
    }
    makeProgressData (project_id:number,budget:number,total_progress:number,create_at:Date){
        return ({
            project_id,
            budget,
            total_progress,
            create_at
        });
    }
}
export default new ProgressRepository(DB.getInstance().connection);