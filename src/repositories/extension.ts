import { IExtension } from "src/models/extension";
import * as mysql from "mysql2";
import { OkPacket } from "mysql2"
import DB from '../DB';
class ExtensionRepository {
    connection:mysql.Connection;
    constructor(connection:any) {
        this.connection = connection
    }
    read(): Promise<IExtension | undefined> {
        return new Promise((resolve, reject) => {
          this.connection?.query<IExtension[]>(
            "SELECT * FROM extension",
            (err, res) => {
              if (err) reject(err)
              else resolve(res?.[0])
            }
          )
        })
    }
    create(url:string): Promise<IExtension> {
        return new Promise((resolve, reject) => {
          this.connection.query<OkPacket>(
            "INSERT INTO extension (url) VALUES(?)",
            [url],
            (err, res) => {
              if (err) reject(err)
              else
                this.read()
                  .then(record => resolve(record!))
                  .catch(reject)
            }
          )
        })
    }
    update(extension: IExtension): Promise<IExtension | undefined> {
        return new Promise((resolve, reject) => {
          this.connection.query<OkPacket>(
            "UPDATE extension SET url = ? WHERE id = ?",
            [extension.url,extension.id],
            (err, res) => {
              if (err) reject(err)
              else
                this.read()
                  .then(resolve)
                  .catch(reject)
            }
          )
        })
    }
    remove(extension_id: number): Promise<number> {
        return new Promise((resolve, reject) => {
          this.connection.query<OkPacket>(
            "DELETE FROM extension WHERE id = ?",
            [extension_id],
            (err, res) => {
              if (err) reject(err)
              else resolve(res.affectedRows)
            }
          )
        })
    }
    makeExtensionData (url:string){
        return ({
           url
        });
    }
}
export default new ExtensionRepository(DB.getInstance().connection);