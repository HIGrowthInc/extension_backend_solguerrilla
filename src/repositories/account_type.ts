import { IAcountType } from "src/models/account_type";
import * as mysql from "mysql2";
import { OkPacket } from "mysql2"
import DB from '../DB';
class AccountTypeRepository {
    connection:mysql.Connection;
    constructor(connection:any) {
        this.connection = connection
    }
    readAll(): Promise<IAcountType[]> {
        return new Promise((resolve, reject) => {      
            this.connection?.query<IAcountType[]>("SELECT * FROM account_type ORDER BY level asc", (err, res) => {
            if (err) reject(err)
                else resolve(res)
              })
            })
          
    }
    readLevelWithMemCount(cntMem: number): Promise<IAcountType | undefined> {
        return new Promise((resolve, reject) => {
            this.connection?.query<IAcountType[]>(
              "SELECT * FROM account_type  WHERE max_count  <= ? ORDER BY level desc",
              [cntMem],
              (err, res) => {
                if (err) reject(err)
                else resolve(res?.[0])
              }
            )
          })
    }
    readById(type_id: number): Promise<IAcountType | undefined> {
        return new Promise((resolve, reject) => {
          this.connection?.query<IAcountType[]>(
            "SELECT * FROM account_type WHERE id = ?",
            [type_id],
            (err, res) => {
              if (err) reject(err)
              else resolve(res?.[0])
            }
          )
        })
    }
    create(accountType: IAcountType): Promise<IAcountType> {
        return new Promise((resolve, reject) => {
          this.connection.query<OkPacket>(
            "INSERT INTO account_type (name,max_count,level) VALUES(?,?,?)",
            [accountType.name,accountType.max_count,accountType.level],
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
    update(accountType: IAcountType): Promise<IAcountType | undefined> {
        return new Promise((resolve, reject) => {
          this.connection.query<OkPacket>(
            "UPDATE account_type SET name = ? , max_count = ?, level = ? WHERE id = ?",
            [accountType.name,accountType.max_count,accountType.level,accountType.id],
            (err, res) => {
              if (err) reject(err)
              else
                this.readById(accountType.id!)
                  .then(resolve)
                  .catch(reject)
            }
          )
        })
    }
    remove(accountType_id: number): Promise<number> {
        return new Promise((resolve, reject) => {
          this.connection.query<OkPacket>(
            "DELETE FROM account_type WHERE id = ?",
            [accountType_id],
            (err, res) => {
              if (err) reject(err)
              else resolve(res.affectedRows)
            }
          )
        })
    }
    makeAccountTypeData (name:string,max_count:number,level:number){
        return ({
            name,
            max_count,
            level
        });
    }
}
export default new AccountTypeRepository(DB.getInstance().connection);