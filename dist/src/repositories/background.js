"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../DB");
class BackgroundRepository {
    constructor(connection) {
        this.connection = connection;
    }
    readByAll() {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM background", (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
    readById(type_id) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM background WHERE id = ?", [type_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res === null || res === void 0 ? void 0 : res[0]);
            });
        });
    }
    create(background) {
        return new Promise((resolve, reject) => {
            this.connection.query("INSERT INTO background (url) VALUES(?)", [background.url], (err, res) => {
                if (err)
                    reject(err);
                else
                    this.readById(res.insertId)
                        .then(user => resolve(user))
                        .catch(reject);
            });
        });
    }
    update(background) {
        return new Promise((resolve, reject) => {
            this.connection.query("UPDATE background SET url = ? WHERE id = ?", [background.url, background.id], (err, res) => {
                if (err)
                    reject(err);
                else
                    this.readById(background.id)
                        .then(resolve)
                        .catch(reject);
            });
        });
    }
    remove(background_id) {
        return new Promise((resolve, reject) => {
            this.connection.query("DELETE FROM background WHERE id = ?", [background_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res.affectedRows);
            });
        });
    }
    makebackgroundData(url) {
        return {
            url
        };
    }
}
exports.default = new BackgroundRepository(DB_1.default.getInstance().connection);
//# sourceMappingURL=background.js.map