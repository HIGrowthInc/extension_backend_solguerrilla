"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../DB");
class ExtensionRepository {
    constructor(connection) {
        this.connection = connection;
    }
    read() {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM extension", (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res === null || res === void 0 ? void 0 : res[0]);
            });
        });
    }
    create(url) {
        return new Promise((resolve, reject) => {
            this.connection.query("INSERT INTO extension (url) VALUES(?)", [url], (err, res) => {
                if (err)
                    reject(err);
                else
                    this.read()
                        .then(record => resolve(record))
                        .catch(reject);
            });
        });
    }
    update(extension) {
        return new Promise((resolve, reject) => {
            this.connection.query("UPDATE extension SET url = ? WHERE id = ?", [extension.url, extension.id], (err, res) => {
                if (err)
                    reject(err);
                else
                    this.read()
                        .then(resolve)
                        .catch(reject);
            });
        });
    }
    remove(extension_id) {
        return new Promise((resolve, reject) => {
            this.connection.query("DELETE FROM extension WHERE id = ?", [extension_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res.affectedRows);
            });
        });
    }
    makeExtensionData(url) {
        return ({
            url
        });
    }
}
exports.default = new ExtensionRepository(DB_1.default.getInstance().connection);
//# sourceMappingURL=extension.js.map