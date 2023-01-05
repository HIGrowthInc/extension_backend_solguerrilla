"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../DB");
class ProgressRepository {
    constructor(connection) {
        this.connection = connection;
    }
    whereIn(column, value) {
        let result = [""];
        result = value.map((item, index) => column + " = " + item + " or");
        let sResult = result.join(" ");
        const lastIndex = sResult.lastIndexOf("or");
        return sResult.slice(0, lastIndex - 1);
    }
    readLatestRecordById(project_id) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM progress WHERE id = ? ORDER BY create_at desc", [project_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res === null || res === void 0 ? void 0 : res[0]);
            });
        });
    }
    readAll() {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM progress", (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
    readAllReachedByGroupWithProjectIds(ids) {
        const whereState = this.whereIn("project_id", ids);
        // console.log("SELECT * FROM progress Group By project_id WHERE "+whereState);
        const statement = ids.length ? "WHERE " + whereState : "";
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT projects.title FROM projects WHERE id=ANY(SELECT project_id  FROM progress " + statement + "  Group By project_id  HAVING MAX(budget) <MAX(total_progress))", (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
    readAllByGroupWithProjectIds(ids) {
        const whereState = this.whereIn("project_id", ids);
        // console.log("SELECT * FROM progress Group By project_id WHERE "+whereState);
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM progress WHERE " + whereState + " Group By project_id  ", (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
    readLatestRecordByProjectID(project_id) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM progress WHERE project_id = ? ORDER BY create_at desc", [project_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res === null || res === void 0 ? void 0 : res[0]);
            });
        });
    }
    readById(progress_id) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM progress WHERE id = ?", [progress_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res === null || res === void 0 ? void 0 : res[0]);
            });
        });
    }
    create(progress) {
        return new Promise((resolve, reject) => {
            this.connection.query("INSERT INTO progress (project_id,budget,total_progress,create_at) VALUES(?,?,?,?)", [progress.project_id, progress.budget, progress.total_progress, progress.create_at], (err, res) => {
                if (err)
                    reject(err);
                else
                    this.readById(res.insertId)
                        .then(user => resolve(user))
                        .catch(reject);
            });
        });
    }
    update(progress) {
        return new Promise((resolve, reject) => {
            this.connection.query("UPDATE progress SET project_id = ?,budget = ?,total_progress = ? WHERE id = ?", [progress.project_id, progress.budget, progress.total_progress, progress.id], (err, res) => {
                if (err)
                    reject(err);
                else
                    this.readById(progress.id)
                        .then(resolve)
                        .catch(reject);
            });
        });
    }
    remove(progress_id) {
        return new Promise((resolve, reject) => {
            this.connection.query("DELETE FROM progress WHERE id = ?", [progress_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res.affectedRows);
            });
        });
    }
    makeProgressData(project_id, budget, total_progress, create_at) {
        return ({
            project_id,
            budget,
            total_progress,
            create_at
        });
    }
}
exports.default = new ProgressRepository(DB_1.default.getInstance().connection);
//# sourceMappingURL=progress.js.map