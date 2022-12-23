import { ICardType } from "src/models/cards";
import * as mysql from "mysql2";
import { OkPacket } from "mysql2"
import DB from '../DB';
class CardsRepository {
    connection:mysql.Connection;
    constructor(connection:any) {
        this.connection = connection
    }
    readAll(): Promise<ICardType[]> {
        return new Promise((resolve, reject) => {      
            this.connection?.query<ICardType[]>("SELECT * FROM cards ORDER BY create_at desc", (err, res) => {
            if (err) reject(err)
                else resolve(res)
              })
            })
          
    }
    
    readById(card_id: number): Promise<ICardType | undefined> {
        return new Promise((resolve, reject) => {
          this.connection?.query<ICardType[]>(
            "SELECT * FROM cards WHERE id = ?",
            [card_id],
            (err, res) => {
              if (err) reject(err)
              else resolve(res?.[0])
            }
          )
        })
    }
    create(card: ICardType): Promise<ICardType> {
        return new Promise((resolve, reject) => {
          this.connection.query<OkPacket>(
            "INSERT INTO cards (title,summary,source,link,img_url,create_at) VALUES(?,?,?,?,?,?)",
            [card.title,card.summary,card.source,card.link,card.img_url,card.create_at],
            (err, res) => {
              if (err) reject(err)
              else
                this.readById(res.insertId)
                  .then(card => resolve(card!))
                  .catch(reject)
            }
          )
        })
    }
    update(card: ICardType): Promise<ICardType | undefined> {
        return new Promise((resolve, reject) => {
          this.connection.query<OkPacket>(
            "UPDATE cards SET title = ? , summary = ?, source = ? , link = ? ,img_url = ? , create_at = ? WHERE id = ?",
            [card.title,card.summary,card.source,card.link, card.img_url ,card.create_at,card.id],
            (err, res) => {
              if (err) reject(err)
              else
                this.readById(card.id!)
                  .then(resolve)
                  .catch(reject)
            }
          )
        })
    }
    remove(card_id: number): Promise<number> {
        return new Promise((resolve, reject) => {
          this.connection.query<OkPacket>(
            "DELETE FROM cards WHERE id = ?",
            [card_id],
            (err, res) => {
              if (err) reject(err)
              else resolve(res.affectedRows)
            }
          )
        })
    }
    makeCardData (title:string,summary:string,source:string,link:string, img_url:string ,create_at:Date){
        return ({
            title,
            summary,
            source,
            link,
            img_url,
            create_at
        } as ICardType);
    }
}
export default new CardsRepository(DB.getInstance().connection);