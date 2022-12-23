import {IInvite} from '../models/invite';
import * as mysql from "mysql2";
import { OkPacket } from "mysql2"
import DB from '../DB';
class InviteRepository {
    connection:mysql.Connection;
    constructor(connection:any) {
        this.connection = connection
    }
    readAll(): Promise<IInvite[]> {
        return new Promise((resolve, reject) => {      
            this.connection?.query<IInvite[]>("SELECT * FROM invite", (err, res) => {
            if (err) reject(err)
                else resolve(res)
              })
            })
          
    }
    readAcceptRecords(user_id:number,from:Date,to:Date): Promise<IInvite[]> {
      return new Promise((resolve, reject) => {      
          this.connection?.query<IInvite[]>("SELECT * FROM invite WHERE user_id=?  AND accept_at >= ? AND accept_at <= ?",
          [user_id,from,to], (err, res) => {
          if (err) reject(err)
              else resolve(res)
            })
          })
        
  
        }
  
  readJoinRecords(user_id:number,from:Date,to:Date): Promise<IInvite[]> {
    return new Promise((resolve, reject) => {      
        this.connection?.query<IInvite[]>("SELECT first_name , last_name ,username FROM users WHERE email = ANY (SELECT email FROM invite  WHERE user_id=? AND joind_at >= ? AND joind_at <= ?)",
        [user_id,from,to], (err, res) => {
        if (err) reject(err)
            else resolve(res)
          })
        })
      
}
    readById(user_id: number): Promise<IInvite | undefined> {
        return new Promise((resolve, reject) => {
          this.connection?.query<IInvite[]>(
            "SELECT * FROM invite WHERE id = ?",
            [user_id],
            (err, res) => {
              if (err) reject(err)
              else resolve(res?.[0])
            }
          )
        })
    }
    readByHash(hash: string): Promise<IInvite | undefined> {
        return new Promise((resolve, reject) => {
          this.connection?.query<IInvite[]>(
            "SELECT * FROM invite WHERE hash = ?",
            [hash],
            (err, res) => {
              if (err) reject(err)
              else resolve(res?.[0])
            }
          )
        })
    }
    create(invite: IInvite): Promise<IInvite> {
        return new Promise((resolve, reject) => {

          this.connection.query<OkPacket>(
            "INSERT INTO invite (user_id, email, is_accept, is_joined ,hash,create_at,accept_at,joind_at) VALUES(?,?,?,?,?,?,?,?)",
            [invite.user_id,invite.email,invite.is_accept,invite.is_joined,invite.hash,invite.create_at,invite.accept_at,invite.joind_at],
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
    update(invite: IInvite): Promise<IInvite | undefined> {
        return new Promise((resolve, reject) => {
          this.connection.query<OkPacket>(
            "UPDATE invite SET user_id = ? , email = ?, is_accept = ?, is_joined = ? ,hash = ?,create_at = ?,accept_at = ?,joind_at = ? WHERE id = ?",
            [invite.user_id,invite.email,invite.is_accept,invite.is_joined,invite.hash,invite.create_at,invite.accept_at,invite.joind_at, invite.id],
            (err, res) => {
              if (err) reject(err)
              else
                this.readById(invite.id!)
                  .then(resolve)
                  .catch(reject)
            }
          )
        })
    }
    remove(invite_id: number): Promise<number> {
        return new Promise((resolve, reject) => {
          this.connection.query<OkPacket>(
            "DELETE FROM invite WHERE id = ?",
            [invite_id],
            (err, res) => {
              if (err) reject(err)
              else resolve(res.affectedRows)
            }
          )
        })
    }
    makeInviteData (user_id:number, email:string, is_accpet:number, is_joined:number ,hash:string,create_at:Date,accept_at:Date | null,joined_at:Date | null){
        return ({
            user_id:user_id,
            email:email,
            is_accept: is_accpet,
            is_joined:is_joined,
            hash:hash,
            create_at:create_at,
            accept_at:accept_at,
            joind_at:joined_at
        });
    }
}
export default new InviteRepository(DB.getInstance().connection);