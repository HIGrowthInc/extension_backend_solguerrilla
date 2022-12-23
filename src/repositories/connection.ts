import { IConnection } from "src/models/connection";
import * as mysql from "mysql2";
import { OkPacket } from "mysql2"
import DB from '../DB';
class ConnectionRepository {
    connection:mysql.Connection;
    constructor(connection:any) {
        this.connection = connection
    }
    readAll(): Promise<IConnection[]> {
        return new Promise((resolve, reject) => {      
            this.connection?.query<IConnection[]>("SELECT * FROM connection", (err, res) => {
            if (err) reject(err)
                else resolve(res)
              })
            })
          
    }
    readLatestConnectionByUserId(user_id:number):Promise<IConnection | undefined>{
        return new Promise((resolve, reject) => {
            this.connection?.query<IConnection[]>(
              "SELECT * FROM connection WHERE user_id = ? ORDER BY create_at desc",
              [user_id],
              (err, res) => {
                if (err) reject(err)
                else resolve(res?.[0])
              }
            )
          })    
    }
    readLatestConnectionByUserIdWithCondition(user_id:number,from:Date,to:Date):Promise<IConnection[]>{
      return new Promise((resolve, reject) => {
          this.connection?.query<IConnection[]>(
            "SELECT * FROM connection WHERE user_id = ? AND create_at >= ? AND create_at <= ? ORDER BY create_at desc",
            [user_id,from,to],
            (err, res) => {
              if (err) reject(err)
              else resolve(res)
            }
          )
        })    
  }
  readMaxTotalMember(user_id:number,from,to:Date):Promise<IConnection | undefined>{
    return new Promise((resolve, reject) => {
      this.connection?.query<IConnection[]>(
        " SELECT MIN(total_member) as min_member, MAX(total_member) as max_member FROM connection WHERE user_id=? AND create_at >=? AND create_at <= ?  GROUP BY user_id  ORDER BY create_at desc",
        [user_id,from,to],
        (err, res) => {
          if (err) reject(err)
          else resolve(res?.[0])
        }
      )
    }) 
  }
  readWithUserNotification(user_id:number,from:Date,to:Date):Promise<IConnection []>{
    return new Promise((resolve, reject) => {
      this.connection?.query<IConnection[]>(
        "SELECT connection.id, connection.total_member, users.first_name, users.last_name FROM connection LEFT JOIN users ON connection.follow_id = users.id WHERE user_id = ? AND connection.create_at >= ? AND connection.create_at <= ? ORDER BY connection.create_at desc",
        [user_id,from,to],
        (err, res) => {
          if (err) reject(err)
          else resolve(res)
        }
      )
    }) 
  }
    readById(collect_id: number): Promise<IConnection | undefined> {
        return new Promise((resolve, reject) => {
          this.connection?.query<IConnection[]>(
            "SELECT * FROM connection WHERE id = ?",
            [collect_id],
            (err, res) => {
              if (err) reject(err)
              else resolve(res?.[0])
            }
          )
        })
    }
    create(connect: IConnection): Promise<IConnection> {
        return new Promise((resolve, reject) => {
          this.connection.query<OkPacket>(
            "INSERT INTO connection (user_id,total_member,follow_id,create_at) VALUES(?,?,?,?)",
            [connect.user_id,connect.total_member,connect.follow_id,connect.create_at],
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
    update(connect: IConnection): Promise<IConnection | undefined> {
        return new Promise((resolve, reject) => {
          this.connection.query<OkPacket>(
            "UPDATE connection SET user_id = ?, total_member = ?, follow_id = ? WHERE id = ?",
            [connect.user_id,connect.total_member,connect.follow_id,connect.id],
            (err, res) => {
              if (err) reject(err)
              else
                this.readById(connect.id!)
                  .then(resolve)
                  .catch(reject)
            }
          )
        })
    }
    remove(connect_id: number): Promise<number> {
        return new Promise((resolve, reject) => {
          this.connection.query<OkPacket>(
            "DELETE FROM connection WHERE id = ?",
            [connect_id],
            (err, res) => {
              if (err) reject(err)
              else resolve(res.affectedRows)
            }
          )
        })
    }
    makeConnectionData (user_id:number,total_member:number,follow_id:number,create_at:Date){
        return ({
            user_id,
            total_member,
            follow_id,
            create_at
        });
    }
}
export default new ConnectionRepository(DB.getInstance().connection);