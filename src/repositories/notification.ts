import { INotification } from "../models/notification";
import * as mysql from "mysql2";
import { OkPacket } from "mysql2"
import DB from '../DB';
class notificationRepository {
    connection:mysql.Connection;
    constructor(connection:any) {
        this.connection = connection
    }
    readAll(): Promise<INotification[]> {
        return new Promise((resolve, reject) => {      
            this.connection?.query<INotification[]>("SELECT * FROM notification ORDER BY create_at desc", (err, res) => {
            if (err) reject(err)
                else resolve(res)
              })
            })
          
    }
    readNotification(from:Date,to:Date): Promise<INotification[]> {
      return new Promise((resolve, reject) => {      

          this.connection?.query<INotification[]>("SELECT * FROM notification WHERE create_at >= ? and create_at <= ?   ORDER BY create_at desc",
          [from,to], 
          (err, res) => {  
            if (err) reject(err)
                else resolve(res)
              })
          })
        
  }
    readById(notification_id: number): Promise<INotification | undefined> {
        return new Promise((resolve, reject) => {
          this.connection?.query<INotification[]>(
            "SELECT * FROM notification WHERE id = ?",
            [notification_id],
            (err, res) => {
              if (err) reject(err)
              else resolve(res?.[0])
            }
          )
        })
    }
    create(notification: INotification): Promise<INotification> {
        return new Promise((resolve, reject) => {
          this.connection.query<OkPacket>(
            "INSERT INTO notification (text,link,category,create_at) VALUES(?,?,?,?)",
            [notification.text,notification.link,notification.category,notification.create_at],
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
    update(notification: INotification): Promise<INotification | undefined> {
        return new Promise((resolve, reject) => {
          this.connection.query<OkPacket>(
            "UPDATE notification SET text = ?,link = ?,category = ? WHERE id = ?",
            [notification.text,notification.link,notification.category,notification.id],
            (err, res) => {
              if (err) reject(err)
              else
                this.readById(notification.id!)
                  .then(resolve)
                  .catch(reject)
            }
          )
        })
    }
    remove(notification_id: number): Promise<number> {
        return new Promise((resolve, reject) => {
          this.connection.query<OkPacket>(
            "DELETE FROM notification WHERE id = ?",
            [notification_id],
            (err, res) => {
              if (err) reject(err)
              else resolve(res.affectedRows)
            }
          )
        })
    }
    makeNotificationData (text:string,link:string,category:number,create_at:Date){
        return ({
            text,
            link,
            category,
            create_at
        });
    }
}
export default new notificationRepository(DB.getInstance().connection);