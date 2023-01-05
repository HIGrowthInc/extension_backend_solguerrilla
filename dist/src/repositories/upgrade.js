"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../DB");
class UpgradeRepository {
    constructor(connection) {
        this.connection = connection;
    }
    readAll() {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM upgrade", (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
    readLatestRecrodByDate(user_id) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM upgrade WHERE user_id = ? ORDER BY create_at desc", [user_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res === null || res === void 0 ? void 0 : res[0]);
            });
        });
    }
    readById(upgrade_id) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM upgrade WHERE id = ?", [upgrade_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res === null || res === void 0 ? void 0 : res[0]);
            });
        });
    }
    create(record) {
        return new Promise((resolve, reject) => {
            this.connection.query("INSERT INTO upgrade (user_id,to_level_id,create_at) VALUES(?,?,?)", [record.user_id, record.to_level_id, record.create_at], (err, res) => {
                if (err)
                    reject(err);
                else
                    this.readById(res.insertId)
                        .then(user => resolve(user))
                        .catch(reject);
            });
        });
    }
    update(record) {
        return new Promise((resolve, reject) => {
            this.connection.query("UPDATE upgrade SET user_id = ?,to_level_id = ? WHERE id = ?", [record.user_id, record.to_level_id, record.id], (err, res) => {
                if (err)
                    reject(err);
                else
                    this.readById(record.id)
                        .then(resolve)
                        .catch(reject);
            });
        });
    }
    remove(record_id) {
        return new Promise((resolve, reject) => {
            this.connection.query("DELETE FROM upgrade WHERE id = ?", [record_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res.affectedRows);
            });
        });
    }
    makeSupportProjectData(user_id, to_level_id, create_at) {
        return ({
            user_id, to_level_id, create_at
        });
    }
}
exports.default = new UpgradeRepository(DB_1.default.getInstance().connection);
//# sourceMappingURL=upgrade.js.map