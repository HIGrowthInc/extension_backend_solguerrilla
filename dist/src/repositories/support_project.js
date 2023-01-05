"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../DB");
class SupportProjectRepository {
    constructor(connection) {
        this.connection = connection;
    }
    readAll() {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM support_project", (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
    readSupportPorjectByUserIdANDProjectId(user_id, project_id) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM support_project WHERE user_id = ? AND project_id =?", [user_id, project_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
    readSupportProjectFull(user_id) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT projects.title,support_project.project_id,projects.description,projects.budget,projects.allocate_budget,projects.allocate_budget,total_power,projects.img_url,users.first_name,users.last_name,users.email ,users.image_url FROM support_project LEFT JOIN projects ON project_id = projects.id LEFT JOIN users ON support_project.user_id = users.id WHERE user_id =?", [user_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
    readSupportProject(user_id) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM support_project WHERE user_id = ?   GROUP BY project_id  ", [user_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
    readSupportCountProject() {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT project_id,COUNT(project_id) as cnt FROM support_project GROUP BY project_id", (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
    readLatestRecrodByDate(project_id) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM support_project WHERE project_id = ? ORDER BY create_at desc", [project_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res === null || res === void 0 ? void 0 : res[0]);
            });
        });
    }
    readById(project_id) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM support_project WHERE id = ?", [project_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res === null || res === void 0 ? void 0 : res[0]);
            });
        });
    }
    create(record) {
        return new Promise((resolve, reject) => {
            this.connection.query("INSERT INTO support_project (project_id,user_id,total_support,create_at) VALUES(?,?,?,?)", [record.project_id, record.user_id, record.total_support, record.create_at], (err, res) => {
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
            this.connection.query("UPDATE support_project SET project_id = ?,user_id = ?,total_support =? WHERE id = ?", [record.project_id, record.user_id, record.total_support, record.id], (err, res) => {
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
            this.connection.query("DELETE FROM support_project WHERE id = ?", [record_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res.affectedRows);
            });
        });
    }
    makeSupportProjectData(project_id, user_id, total_support, create_at) {
        return ({
            project_id, user_id, total_support, create_at
        });
    }
}
exports.default = new SupportProjectRepository(DB_1.default.getInstance().connection);
//# sourceMappingURL=support_project.js.map