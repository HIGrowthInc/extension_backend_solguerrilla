"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../DB");
class notificationRepository {
    constructor(connection) {
        this.connection = connection;
    }
    readAll() {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM notification ORDER BY create_at desc", (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
    readNotification(from, to) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM notification WHERE create_at >= ? and create_at <= ?   ORDER BY create_at desc", [from, to], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
    readById(notification_id) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM notification WHERE id = ?", [notification_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res === null || res === void 0 ? void 0 : res[0]);
            });
        });
    }
    create(notification) {
        return new Promise((resolve, reject) => {
            this.connection.query("INSERT INTO notification (text,link,category,create_at) VALUES(?,?,?,?)", [notification.text, notification.link, notification.category, notification.create_at], (err, res) => {
                if (err)
                    reject(err);
                else
                    this.readById(res.insertId)
                        .then(user => resolve(user))
                        .catch(reject);
            });
        });
    }
    update(notification) {
        return new Promise((resolve, reject) => {
            this.connection.query("UPDATE notification SET text = ?,link = ?,category = ? WHERE id = ?", [notification.text, notification.link, notification.category, notification.id], (err, res) => {
                if (err)
                    reject(err);
                else
                    this.readById(notification.id)
                        .then(resolve)
                        .catch(reject);
            });
        });
    }
    remove(notification_id) {
        return new Promise((resolve, reject) => {
            this.connection.query("DELETE FROM notification WHERE id = ?", [notification_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res.affectedRows);
            });
        });
    }
    makeNotificationData(text, link, category, create_at) {
        return ({
            text,
            link,
            category,
            create_at
        });
    }
}
exports.default = new notificationRepository(DB_1.default.getInstance().connection);
//# sourceMappingURL=notification.js.map