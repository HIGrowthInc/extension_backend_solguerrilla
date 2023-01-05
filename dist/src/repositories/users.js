"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../DB");
class UsersRepository {
    constructor(connection) {
        this.connection = connection;
    }
    readAll() {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM users", (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
    readAllUserWithAccountType() {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("\
      SELECT u.id, u.email, u.first_name, u.last_name, u.city, u.state, u.country, u.image_url, a.name as type_name, u.create_at, IFNULL(MAX(c.total_member), 0) points FROM users u \
              LEFT JOIN account_type a ON u.account_type = a.id \
              LEFT JOIN connection c   ON c.user_id = u.id\
              GROUP BY u.id\
              ORDER BY u.create_at desc", (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
    readById(user_id) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM users WHERE id = ?", [user_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res === null || res === void 0 ? void 0 : res[0]);
            });
        });
    }
    readByEmail(email) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM users WHERE email = ?", [email], (err, res) => {
                if (err)
                    reject(err);
                else {
                    resolve(res === null || res === void 0 ? void 0 : res[0]);
                }
            });
        });
    }
    create(user) {
        return new Promise((resolve, reject) => {
            this.connection.query("INSERT INTO users (username, email, password, first_name , last_name, city , state , country , image_url , is_admin, is_init ,account_type,create_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)", [user.username, user.email, user.password, user.first_name, user.last_name, user.city, user.state, user.country, user.image_url, user.is_admin, 0, user.account_type, user.created_at], (err, res) => {
                if (err)
                    reject(err);
                else
                    this.readById(res.insertId)
                        .then(user => resolve(user))
                        .catch(reject);
            });
        });
    }
    update(user) {
        return new Promise((resolve, reject) => {
            this.connection.query("UPDATE users SET username = ?, email = ?, password = ?, last_name = ?,first_name = ?, city = ?, state= ?,country = ?,image_url=?,create_at=?,is_admin= ?,is_init = ?,account_type =? WHERE id = ?", [user.username, user.email, user.password, user.last_name, user.first_name, user.city, user.state, user.country, user.image_url, user.created_at, user.is_admin, user.is_init, user.account_type, user.id], (err, res) => {
                if (err)
                    reject(err);
                else
                    this.readById(user.id)
                        .then(resolve)
                        .catch(reject);
            });
        });
    }
    remove(user_id) {
        return new Promise((resolve, reject) => {
            this.connection.query("DELETE FROM users WHERE id = ?", [user_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res.affectedRows);
            });
        });
    }
}
exports.default = new UsersRepository(DB_1.default.getInstance().connection);
//# sourceMappingURL=users.js.map