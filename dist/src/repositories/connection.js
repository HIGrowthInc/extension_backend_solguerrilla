"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../DB");
class ConnectionRepository {
    constructor(connection) {
        this.connection = connection;
    }
    readAll() {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM connection", (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
    readLatestConnectionByUserId(user_id) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM connection WHERE user_id = ? ORDER BY create_at desc", [user_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res === null || res === void 0 ? void 0 : res[0]);
            });
        });
    }
    readLatestConnectionByUserIdWithCondition(user_id, from, to) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM connection WHERE user_id = ? AND create_at >= ? AND create_at <= ? ORDER BY create_at desc", [user_id, from, to], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
    readMaxTotalMember(user_id, from, to) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query(" SELECT MIN(total_member) as min_member, MAX(total_member) as max_member FROM connection WHERE user_id=? AND create_at >=? AND create_at <= ?  GROUP BY user_id  ORDER BY create_at desc", [user_id, from, to], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res === null || res === void 0 ? void 0 : res[0]);
            });
        });
    }
    readWithUserNotification(user_id, from, to) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT connection.id, connection.total_member, users.first_name, users.last_name FROM connection LEFT JOIN users ON connection.follow_id = users.id WHERE user_id = ? AND connection.create_at >= ? AND connection.create_at <= ? ORDER BY connection.create_at desc", [user_id, from, to], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
    readById(collect_id) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM connection WHERE id = ?", [collect_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res === null || res === void 0 ? void 0 : res[0]);
            });
        });
    }
    create(connect) {
        return new Promise((resolve, reject) => {
            this.connection.query("INSERT INTO connection (user_id,total_member,follow_id,create_at) VALUES(?,?,?,?)", [connect.user_id, connect.total_member, connect.follow_id, connect.create_at], (err, res) => {
                if (err)
                    reject(err);
                else
                    this.readById(res.insertId)
                        .then(user => resolve(user))
                        .catch(reject);
            });
        });
    }
    update(connect) {
        return new Promise((resolve, reject) => {
            this.connection.query("UPDATE connection SET user_id = ?, total_member = ?, follow_id = ? WHERE id = ?", [connect.user_id, connect.total_member, connect.follow_id, connect.id], (err, res) => {
                if (err)
                    reject(err);
                else
                    this.readById(connect.id)
                        .then(resolve)
                        .catch(reject);
            });
        });
    }
    remove(connect_id) {
        return new Promise((resolve, reject) => {
            this.connection.query("DELETE FROM connection WHERE id = ?", [connect_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res.affectedRows);
            });
        });
    }
    makeConnectionData(user_id, total_member, follow_id, create_at) {
        return ({
            user_id,
            total_member,
            follow_id,
            create_at
        });
    }
}
exports.default = new ConnectionRepository(DB_1.default.getInstance().connection);
//# sourceMappingURL=connection.js.map