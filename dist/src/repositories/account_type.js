"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../DB");
class AccountTypeRepository {
    constructor(connection) {
        this.connection = connection;
    }
    readAll() {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM account_type ORDER BY level asc", (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
    readLevelWithMemCount(cntMem) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM account_type  WHERE max_count  <= ? ORDER BY level desc", [cntMem], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res === null || res === void 0 ? void 0 : res[0]);
            });
        });
    }
    readById(type_id) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM account_type WHERE id = ?", [type_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res === null || res === void 0 ? void 0 : res[0]);
            });
        });
    }
    create(accountType) {
        return new Promise((resolve, reject) => {
            this.connection.query("INSERT INTO account_type (name,max_count,level) VALUES(?,?,?)", [accountType.name, accountType.max_count, accountType.level], (err, res) => {
                if (err)
                    reject(err);
                else
                    this.readById(res.insertId)
                        .then(user => resolve(user))
                        .catch(reject);
            });
        });
    }
    update(accountType) {
        return new Promise((resolve, reject) => {
            this.connection.query("UPDATE account_type SET name = ? , max_count = ?, level = ? WHERE id = ?", [accountType.name, accountType.max_count, accountType.level, accountType.id], (err, res) => {
                if (err)
                    reject(err);
                else
                    this.readById(accountType.id)
                        .then(resolve)
                        .catch(reject);
            });
        });
    }
    remove(accountType_id) {
        return new Promise((resolve, reject) => {
            this.connection.query("DELETE FROM account_type WHERE id = ?", [accountType_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res.affectedRows);
            });
        });
    }
    makeAccountTypeData(name, max_count, level) {
        return ({
            name,
            max_count,
            level
        });
    }
}
exports.default = new AccountTypeRepository(DB_1.default.getInstance().connection);
//# sourceMappingURL=account_type.js.map