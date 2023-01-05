"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../DB");
class CardsRepository {
    constructor(connection) {
        this.connection = connection;
    }
    readAll() {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM cards ORDER BY create_at desc", (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
    readById(card_id) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM cards WHERE id = ?", [card_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res === null || res === void 0 ? void 0 : res[0]);
            });
        });
    }
    create(card) {
        return new Promise((resolve, reject) => {
            this.connection.query("INSERT INTO cards (title,summary,source,link,img_url,create_at) VALUES(?,?,?,?,?,?)", [card.title, card.summary, card.source, card.link, card.img_url, card.create_at], (err, res) => {
                if (err)
                    reject(err);
                else
                    this.readById(res.insertId)
                        .then(card => resolve(card))
                        .catch(reject);
            });
        });
    }
    update(card) {
        return new Promise((resolve, reject) => {
            this.connection.query("UPDATE cards SET title = ? , summary = ?, source = ? , link = ? ,img_url = ? , create_at = ? WHERE id = ?", [card.title, card.summary, card.source, card.link, card.img_url, card.create_at, card.id], (err, res) => {
                if (err)
                    reject(err);
                else
                    this.readById(card.id)
                        .then(resolve)
                        .catch(reject);
            });
        });
    }
    remove(card_id) {
        return new Promise((resolve, reject) => {
            this.connection.query("DELETE FROM cards WHERE id = ?", [card_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res.affectedRows);
            });
        });
    }
    makeCardData(title, summary, source, link, img_url, create_at) {
        return {
            title,
            summary,
            source,
            link,
            img_url,
            create_at
        };
    }
}
exports.default = new CardsRepository(DB_1.default.getInstance().connection);
//# sourceMappingURL=cards.js.map