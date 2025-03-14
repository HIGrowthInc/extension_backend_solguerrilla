import {IUser} from '../models/users';
import * as mysql from "mysql2";
import { OkPacket } from "mysql2"
import DB from '../DB';
class UsersRepository {
  connection:mysql.Connection;
  constructor(connection:any) {
    this.connection = connection
  }
  readAll(): Promise<IUser[]> {
    return new Promise((resolve, reject) => {      
        this.connection?.query<IUser[]>("SELECT * FROM users", (err, res) => {
        if (err) reject(err)
            else resolve(res)
          })
        })
      
  }
  readAllUserWithAccountType():Promise<IUser[]>{
    return new Promise((resolve, reject) => {      
      this.connection?.query<IUser[]>("\
      SELECT u.id, u.email, u.first_name, u.last_name, u.city, u.state, u.country, u.image_url, a.name as type_name, u.is_admin, u.create_at, IFNULL(MAX(c.total_member), 0) points FROM users u \
              LEFT JOIN account_type a ON u.account_type = a.id \
              LEFT JOIN connection c   ON c.user_id = u.id\
              GROUP BY u.id\
              ORDER BY u.create_at desc", (err, res) => {
      if (err) reject(err)
          else resolve(res)
        })
      })
  }
  readById(user_id: number): Promise<IUser | undefined> {
    return new Promise((resolve, reject) => {
      this.connection?.query<IUser[]>(
        "SELECT * FROM users WHERE id = ?",
        [user_id],
        (err, res) => {
          if (err) reject(err)
          else resolve(res?.[0])
        }
      )
    })
  }
  readByEmail(email: string): Promise<IUser | undefined> {
    return new Promise((resolve, reject) => {
      this.connection?.query<IUser[]>(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, res) => {
          if (err) reject(err)
          else {
            resolve(res?.[0])
          }
        }
      )
    })
  }
  create(user: IUser): Promise<IUser> {
    return new Promise((resolve, reject) => {
      this.connection.query<OkPacket>(
        "INSERT INTO users (username, email, password, first_name , last_name, city , state , country , image_url , is_admin, is_init ,account_type,create_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [user.username, user.email, user.password, user.first_name, user.last_name, user.city,user.state, user.country, user.image_url, user.is_admin ,0,user.account_type,user.created_at],
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
  update(user: IUser): Promise<IUser | undefined> {
    return new Promise((resolve, reject) => {
      this.connection.query<OkPacket>(
        "UPDATE users SET username = ?, email = ?, password = ?, last_name = ?,first_name = ?, city = ?, state= ?,country = ?,image_url=?,create_at=?,is_admin= ?,is_init = ?,account_type =? WHERE id = ?",
        [user.username, user.email, user.password, user.last_name,user.first_name,user.city,user.state,user.country,user.image_url, user.created_at,user.is_admin,user.is_init,user.account_type ,user.id],
        (err, res) => {
          if (err) reject(err)
          else
            this.readById(user.id!)
              .then(resolve)
              .catch(reject)
        }
      )
    })
  }
  remove(user_id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      this.connection.query<OkPacket>(
        "DELETE FROM users WHERE id = ?",
        [user_id],
        (err, res) => {
          if (err) reject(err)
          else resolve(res.affectedRows)
        }
      )
    })
  }

}
export default new UsersRepository(DB.getInstance().connection);
