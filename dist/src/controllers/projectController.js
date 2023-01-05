"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const support_project_1 = require("../repositories/support_project");
const project_1 = require("../repositories/project");
const users_1 = require("../repositories/users");
const progress_1 = require("../repositories/progress");
const path = require("path");
const fs = require('fs');
class ProjectController {
    constructor() {
        this.getProject = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.query;
            if (!id) {
                res.status(200).json({ status: false, message: "id params is invalid" });
                return;
            }
            try {
                console.log("id", id);
                const projectRecord = yield project_1.default.readAllWithUserById(parseInt(id.toString()));
                if (!projectRecord.length) {
                    res.status(200).json({ status: false, message: "no project" });
                    return;
                }
                const left_days = this.calculateIsAllocatedPermission(projectRecord[0].publish_at);
                const progress = yield progress_1.default.readLatestRecordByProjectID(projectRecord[0].id);
                console.log("progress", progress);
                let total_progress;
                const result = {
                    title: projectRecord[0].title,
                    description: projectRecord[0].description,
                    budget: projectRecord[0].budget,
                    link: projectRecord[0].link,
                    allocate_budget: projectRecord[0].allocate_budget,
                    total_power: projectRecord[0].total_power,
                    project_image: projectRecord[0].img_url,
                    publish_at: projectRecord[0].publish_at,
                    seted_date: projectRecord[0].seted_date,
                    user_name: projectRecord[0].first_name + " " + projectRecord[0].last_name,
                    user_img: projectRecord[0].image_url,
                    email: projectRecord[0].email,
                    state: projectRecord[0].state,
                    country: projectRecord[0].country,
                    city: projectRecord[0].city,
                    total_progress: (progress === null || progress === void 0 ? void 0 : progress.total_progress) ? progress === null || progress === void 0 ? void 0 : progress.total_progress : 0,
                    isAllocate: left_days <= 2 ? true : false
                };
                res.status(200).json({ status: true, detail: result });
            }
            catch (error) {
                res.status(500).json({ status: false, error: error });
            }
        });
        this.getProjectsForAny = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const records = yield project_1.default.readAllWithUserForAny();
                const supportCountRecord = yield support_project_1.default.readSupportCountProject();
                return res.status(200).json({ status: true, records: records, support: supportCountRecord });
            }
            catch (error) {
                res.status(500).json({ status: false, error: error });
            }
        });
        this.getProjects = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            console.log("email", email);
            if (!email) {
                res.status(200).json({ status: false, message: "There are not this email" });
                return;
            }
            const userRecord = yield users_1.default.readByEmail(email);
            if (!userRecord) {
                res.status(200).json({ status: false, message: "There is no user in this site" });
                return;
            }
            const user_id = userRecord.id;
            try {
                const projects = yield project_1.default.readAllWithUserForAny();
                const projectIds = projects.map((item) => { var _a; return (_a = item.id) === null || _a === void 0 ? void 0 : _a.toString(); });
                const supportProjectsByUser = yield support_project_1.default.readSupportProject(user_id);
                const progress = yield progress_1.default.readAllByGroupWithProjectIds(projectIds);
                const supportCountRecord = yield support_project_1.default.readSupportCountProject();
                res.status(200).json({ status: true, projects: projects, support: supportProjectsByUser, progress: progress, countRecord: supportCountRecord });
                return;
            }
            catch (error) {
                console.log("error", error);
                res.status(500).json({ status: false, error: error });
            }
        });
        this.submitProject = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { title, description, budget, total_power, city, state, country, link } = req.body;
            const img_url = req['file'].filename;
            if (!title || !description || !budget || !total_power || !city || !country || !state || !link)
                return;
            if (!req.user || !(req === null || req === void 0 ? void 0 : req.user['id']))
                return;
            const projectData = project_1.default.makeProjectsData(title, description, budget, req.user['id'], 0, total_power, state, country, city, img_url, null, new Date(), null, link);
            try {
                const project = yield project_1.default.create(projectData);
                res.status(200).json({ status: true, project: project, message: "submit project successful!" });
            }
            catch (error) {
                res.status(500).json({ status: false, error: error });
            }
        });
        this.support = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { project_id } = req.body;
            if (!project_id)
                return;
            if (!req.user || !(req === null || req === void 0 ? void 0 : req.user["id"]))
                return;
            const user_id = req === null || req === void 0 ? void 0 : req.user["id"];
            try {
                const supportRecord = yield support_project_1.default.readSupportPorjectByUserIdANDProjectId(user_id, project_id);
                if (supportRecord.length > 0) {
                    yield supportRecord.map((item) => __awaiter(this, void 0, void 0, function* () {
                        yield support_project_1.default.remove(item.id);
                    }));
                    return res.status(200).json({ status: true, isSupport: false });
                }
                else {
                    const totalSupport = yield this.calTotalsupportForProject(project_id);
                    const supportData = support_project_1.default.makeSupportProjectData(project_id, user_id, totalSupport, new Date());
                    yield support_project_1.default.create(supportData);
                    res.status(200).json({ status: true, isSupport: true });
                }
            }
            catch (error) {
                res.status(500).json({ status: false, error: error });
            }
        });
        this.getProjectImg = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const action = req.query.img;
                // var filePath = path.join(__dirname,"../../uploads/project",action).split("%20").join(" ");
                var filePath = path.join(__dirname, "../../../uploads/project", action).split("%20").join(" ");
                fs.exists(filePath, (exists) => {
                    if (!exists) {
                        res.writeHead(404, {
                            "Content-Type": "text/plain"
                        });
                        res.end("404 Not Found");
                        return;
                    }
                    var ext = path.extname(action);
                    var contentType = "text/plain";
                    if (ext === ".png") {
                        contentType = "image/png";
                    }
                    else if (ext === "jpg" || ext === ".jpeg") {
                        contentType = "image/jpeg";
                    }
                    res.set('Access-Control-Allow-Origin', '*');
                    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                    res.writeHead(200, {
                        "Content-Type": contentType,
                        "Access-Control-Allow-Origin": "*"
                    });
                    fs.readFile(filePath, (err, content) => {
                        res.end(content);
                    });
                });
            }
            catch (error) {
                res.status(500).json({ status: false, error: error });
            }
        });
        this.calTotalsupportForProject = (project_id) => __awaiter(this, void 0, void 0, function* () {
            const latestRecord = yield support_project_1.default.readLatestRecrodByDate(project_id);
            if (latestRecord) {
                return latestRecord.total_support + 1;
            }
            else {
                return 1;
            }
        });
        this.calculateIsAllocatedPermission = (publish_date) => {
            if (!publish_date) {
                return 0;
            }
            const publi_date = new Date(publish_date);
            const set_date_now = new Date();
            let difference = set_date_now.getTime() - publi_date.getTime();
            let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
            return TotalDays;
        };
    }
}
exports.default = ProjectController;
//# sourceMappingURL=projectController.js.map