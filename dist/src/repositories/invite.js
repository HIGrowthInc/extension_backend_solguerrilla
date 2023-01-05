"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../DB");
class InviteRepository {
    constructor(connection) {
        this.connection = connection;
    }
    readAll() {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM invite", (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
    readAcceptRecords(user_id, from, to) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM invite WHERE user_id=?  AND accept_at >= ? AND accept_at <= ?", [user_id, from, to], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
    readJoinRecords(user_id, from, to) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT first_name , last_name ,username FROM users WHERE email = ANY (SELECT email FROM invite  WHERE user_id=? AND joind_at >= ? AND joind_at <= ?)", [user_id, from, to], (err, res) => {
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
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM invite WHERE id = ?", [user_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res === null || res === void 0 ? void 0 : res[0]);
            });
        });
    }
    readByHash(hash) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM invite WHERE hash = ?", [hash], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res === null || res === void 0 ? void 0 : res[0]);
            });
        });
    }
    create(invite) {
        return new Promise((resolve, reject) => {
            this.connection.query("INSERT INTO invite (user_id, email, is_accept, is_joined ,hash,create_at,accept_at,joind_at) VALUES(?,?,?,?,?,?,?,?)", [invite.user_id, invite.email, invite.is_accept, invite.is_joined, invite.hash, invite.create_at, invite.accept_at, invite.joind_at], (err, res) => {
                if (err)
                    reject(err);
                else
                    this.readById(res.insertId)
                        .then(user => resolve(user))
                        .catch(reject);
            });
        });
    }
    update(invite) {
        return new Promise((resolve, reject) => {
            this.connection.query("UPDATE invite SET user_id = ? , email = ?, is_accept = ?, is_joined = ? ,hash = ?,create_at = ?,accept_at = ?,joind_at = ? WHERE id = ?", [invite.user_id, invite.email, invite.is_accept, invite.is_joined, invite.hash, invite.create_at, invite.accept_at, invite.joind_at, invite.id], (err, res) => {
                if (err)
                    reject(err);
                else
                    this.readById(invite.id)
                        .then(resolve)
                        .catch(reject);
            });
        });
    }
    remove(invite_id) {
        return new Promise((resolve, reject) => {
            this.connection.query("DELETE FROM invite WHERE id = ?", [invite_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res.affectedRows);
            });
        });
    }
    makeInviteData(user_id, email, is_accpet, is_joined, hash, create_at, accept_at, joined_at) {
        return ({
            user_id: user_id,
            email: email,
            is_accept: is_accpet,
            is_joined: is_joined,
            hash: hash,
            create_at: create_at,
            accept_at: accept_at,
            joind_at: joined_at
        });
    }
}
exports.default = new InviteRepository(DB_1.default.getInstance().connection);
//# sourceMappingURL=invite.js.map