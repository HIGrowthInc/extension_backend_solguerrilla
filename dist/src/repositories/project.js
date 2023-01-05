"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../DB");
class ProjectsRepository {
    constructor(connection) {
        this.connection = connection;
    }
    readAll() {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM projects ORDER BY create_at desc", (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
    readAllWithUser() {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT projects.id,projects.title, projects.link ,projects.description,projects.budget,projects.allocate_budget,projects.city,projects.state,projects.country,projects.seted_date,projects.create_at, projects.publish_at,projects.total_power,projects.img_url, users.email,users.first_name,users.last_name,users.image_url, MAX(progress.total_progress) as total_progress FROM projects LEFT JOIN progress ON projects.id = progress.project_id LEFT JOIN users ON projects.owner_id = users.id GROUP BY projects.id  ORDER BY projects.create_at desc", (err, res) => {
                console.log("res--", res);
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
    readAllWithUserForAny() {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT projects.id,projects.title,projects.link, projects.description,projects.budget,projects.allocate_budget,projects.city,projects.state,projects.country,projects.seted_date,projects.create_at, projects.publish_at,projects.total_power,projects.img_url,users.first_name,users.last_name,users.image_url  FROM projects  LEFT JOIN users ON projects.owner_id = users.id GROUP BY projects.id  ORDER BY projects.create_at desc", (err, res) => {
                console.log("res--", res);
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
    readAllWithUserById(id) {
        return new Promise((resolve, reject) => {
            var _a;
            // console.log("SELECT projects.id , projects.allocate_budget , projects.budget , projects.publish_at , progress.total_progress , MAX(progress.total_progress) FROM projects  FULL JOIN progress  ON projects.id = progress.project_id GROUP BY projects.id ");      
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT projects.id,projects.title,projects.link, projects.description,projects.budget,projects.allocate_budget,projects.city,projects.state,projects.country,projects.seted_date,projects.create_at, projects.publish_at,projects.total_power,projects.img_url, users.email,users.first_name,users.last_name,users.image_url FROM projects LEFT JOIN users ON projects.owner_id = users.id WHERE projects.id =?", [id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
    // readAllWithUser(): Promise<IProjects[]> {
    //   return new Promise((resolve, reject) => {      
    //       this.connection?.query<IProjects[]>("SELECT * FROM projects AS p LEFT JOIN users AS u ON p.owner_id = u.id LEFT JOIN progress AS prog ON prog.project_id = p.id GROUP BY prog.project_id ORDER BY p.create_at DESC", (err, res) => {
    //       if (err) reject(err)
    //           else resolve(res)
    //         })
    //       })
    // }
    readById(project_id) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT * FROM projects WHERE id = ?", [project_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res === null || res === void 0 ? void 0 : res[0]);
            });
        });
    }
    readSupportBetweenTime(user_id, from, to) {
        return new Promise((resolve, reject) => {
            var _a;
            // console.log("SELECT projects.id , projects.allocate_budget , projects.budget , projects.publish_at , progress.total_progress , MAX(progress.total_progress) FROM projects  FULL JOIN progress  ON projects.id = progress.project_id GROUP BY projects.id ");      
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT projects.id,projects.total_power FROM projects WHERE id = ANY (SELECT project_id FROM support_project WHERE user_id = ? AND create_at >=? AND create_at <= ?)", [user_id, from, to], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
    readSupportTillTime(user_id, to) {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.query("SELECT projects.id,projects.total_power FROM projects WHERE id = ANY (SELECT project_id FROM support_project WHERE user_id = ? AND create_at <= ?)", [user_id, to], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
    create(project) {
        return new Promise((resolve, reject) => {
            this.connection.query("INSERT INTO projects (title,description,budget,owner_id,allocate_budget,total_power,img_url,city,state,country,seted_date,create_at,publish_at,link) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [project.title, project.description, project.budget, project.owner_id, project.allocate_budget, project.total_power, project.img_url, project.city, project.state, project.country, project.seted_date, project.create_at, project.publish_at, project.link], (err, res) => {
                if (err)
                    reject(err);
                else
                    this.readById(res.insertId)
                        .then(user => resolve(user))
                        .catch(reject);
            });
        });
    }
    update(project) {
        return new Promise((resolve, reject) => {
            this.connection.query("UPDATE projects SET title = ?,description = ?,budget = ?,owner_id = ?,allocate_budget = ?,total_power=?,img_url = ?,state = ?,city = ? , country=?,seted_date = ?,publish_at = ? ,link = ? WHERE id = ?", [project.title, project.description, project.budget, project.owner_id, project.allocate_budget, project.total_power, project.img_url, project.state, project.city, project.country, project.seted_date, project.publish_at, project.link, project.id], (err, res) => {
                if (err)
                    reject(err);
                else
                    this.readById(project.id)
                        .then(resolve)
                        .catch(reject);
            });
        });
    }
    updateUnPublish(project) {
        return new Promise((resolve, reject) => {
            this.connection.query("UPDATE projects SET publish_at = NULL WHERE id = ?", [project.id], (err, res) => {
                if (err)
                    reject(err);
                else
                    this.readById(project.id)
                        .then(resolve)
                        .catch(reject);
            });
        });
    }
    remove(project_id) {
        return new Promise((resolve, reject) => {
            this.connection.query("DELETE FROM projects WHERE id = ?", [project_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res.affectedRows);
            });
        });
    }
    makeProjectsData(title, description, budget, owner_id, allocate_budget, total_power, state, country, city, img_url, seted_date, create_at, publish_at, link) {
        return ({
            title, description, budget, owner_id, allocate_budget, total_power, img_url, state, city, country, seted_date, create_at, publish_at, link
        });
    }
}
exports.default = new ProjectsRepository(DB_1.default.getInstance().connection);
//# sourceMappingURL=project.js.map