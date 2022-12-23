import { IBackground } from "src/models/background";
import * as mysql from "mysql2";
import { OkPacket } from "mysql2"
import DB from '../DB';
class BackgroundRepository {
    connection:mysql.Connection;
    constructor(connection:any) {
        this.connection = connection
    }
    readByAll(): Promise<IBackground[]> {
        return new Promise((resolve, reject) => {
          this.connection?.query<IBackground[]>(
            "SELECT * FROM background",
            (err, res) => {
              if (err) reject(err)
              else resolve(res)
            }
          )
        })
    }
    readById(type_id: number): Promise<IBackground | undefined> {
        return new Promise((resolve, reject) => {
          this.connection?.query<IBackground[]>(
            "SELECT * FROM background WHERE id = ?",
            [type_id],
            (err, res) => {
              if (err) reject(err)
              else resolve(res?.[0])
            }
          )
        })
    }
    create(background: IBackground): Promise<IBackground> {
        return new Promise((resolve, reject) => {
          this.connection.query<OkPacket>(
            "INSERT INTO background (url) VALUES(?)",
            [background.url],
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
    update(background: IBackground): Promise<IBackground | undefined> {
        return new Promise((resolve, reject) => {
          this.connection.query<OkPacket>(
            "UPDATE background SET url = ? WHERE id = ?",
            [background.url,background.id],
            (err, res) => {
              if (err) reject(err)
              else
                this.readById(background.id!)
                  .then(resolve)
                  .catch(reject)
            }
          )
        })
    }
    remove(background_id: number): Promise<number> {
        return new Promise((resolve, reject) => {
          this.connection.query<OkPacket>(
            "DELETE FROM background WHERE id = ?",
            [background_id],
            (err, res) => {
              if (err) reject(err)
              else resolve(res.affectedRows)
            }
          )
        })
    }
    makebackgroundData (url:string){
        return ({
            url
        } as IBackground);
    }
}
export default new BackgroundRepository(DB.getInstance().connection);