import { IUpgrade } from "src/models/upgrade";
import * as mysql from "mysql2";
import { OkPacket } from "mysql2"
import DB from '../DB';
class UpgradeRepository {
    connection:mysql.Connection;
    constructor(connection:any) {
        this.connection = connection
    }
    readAll(): Promise<IUpgrade[]> {
        return new Promise((resolve, reject) => {      
            this.connection?.query<IUpgrade[]>("SELECT * FROM upgrade", (err, res) => {
            if (err) reject(err)
                else resolve(res)
              })
            })
          
    }
    readLatestRecrodByDate (user_id:number): Promise<IUpgrade | undefined>{
      return new Promise((resolve, reject) => {
        this.connection?.query<IUpgrade[]>(
          "SELECT * FROM upgrade WHERE user_id = ? ORDER BY create_at desc",
          [user_id],
          (err, res) => {
            if (err) reject(err)
            else resolve(res?.[0])
          }
        )
      })
    }
    readById(upgrade_id: number): Promise<IUpgrade | undefined> {
        return new Promise((resolve, reject) => {
          this.connection?.query<IUpgrade[]>(
            "SELECT * FROM upgrade WHERE id = ?",
            [upgrade_id],
            (err, res) => {
              if (err) reject(err)
              else resolve(res?.[0])
            }
          )
        })
    }
    create(record: IUpgrade): Promise<IUpgrade> {
        return new Promise((resolve, reject) => {
          this.connection.query<OkPacket>(
            "INSERT INTO upgrade (user_id,to_level_id,create_at) VALUES(?,?,?)",
            [record.user_id,record.to_level_id,record.create_at],
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
    update(record: IUpgrade): Promise<IUpgrade | undefined> {
        return new Promise((resolve, reject) => {
          this.connection.query<OkPacket>(
            "UPDATE upgrade SET user_id = ?,to_level_id = ? WHERE id = ?",
            [record.user_id,record.to_level_id,record.id],
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
            "DELETE FROM upgrade WHERE id = ?",
            [record_id],
            (err, res) => {
              if (err) reject(err)
              else resolve(res.affectedRows)
            }
          )
        })
    }
    makeSupportProjectData (user_id:number,to_level_id:number,create_at:Date){
        return ({
            user_id,to_level_id,create_at
        });
    }
}
export default new UpgradeRepository(DB.getInstance().connection);