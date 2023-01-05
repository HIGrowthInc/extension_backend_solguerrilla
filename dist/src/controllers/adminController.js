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
// import * as  jwt from 'jsonwebtoken'
const utils_1 = require("../utils");
const passport_1 = require("../utils/passport");
const refreshToken_1 = require("../utils/refreshToken");
const redis_1 = require("../utils/redis");
const project_1 = require("../repositories/project");
const account_type_1 = require("../repositories/account_type");
const notification_1 = require("../repositories/notification");
const users_1 = require("../repositories/users");
const extension_1 = require("../repositories/extension");
const background_1 = require("../repositories/background");
const cards_1 = require("../repositories/cards");
const path = require("path");
const fs = require('fs');
class AdminController {
    constructor() {
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            res.status(200).json({ status: true });
        });
        this.getProfile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.user) {
                    return res.status(200).json({ status: true, user: req.user });
                }
                else {
                    return res.status(200).json({ status: false });
                }
            }
            catch (error) {
                res.status(500).json({ status: false, error: error });
            }
        });
        this.adminLogin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            passport_1.default.authenticate('local', { session: false }, (err, user, info) => {
                if (info) {
                    return res.status(200).json({
                        message: info.message,
                        status: false
                    });
                }
                if (err || !user) {
                    return res.status(400).json({
                        message: 'Something is not right',
                        user: user
                    });
                }
                if (!user.is_admin) {
                    return res.status(200).json({
                        message: 'You are not admin!',
                        status: false
                    });
                }
                req.login(user, { session: false }, (err) => {
                    if (err) {
                        res.send(err);
                    }
                    // generate a signed son web token with the contents of user object and return it in the response
                    const token = (0, refreshToken_1.getToken)({ jid: user.id });
                    // const refreshToken = getRefreshToken({rid:user.id});
                    redis_1.default.getInstance().setObject(user.id.toString(), {
                        refresh_token: token,
                        expires: eval(utils_1.REFRESH_CONFIG.expiry)
                    });
                    // Set browser httpOnly cookies
                    res.cookie("jwt", token, {
                        secure: false,
                        httpOnly: true
                    });
                    return res.json({ status: true, token: token });
                });
            })(req, res);
        });
        this.dashboard = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const projects = yield project_1.default.readAllWithUser();
                // const projectIds = projects.map((item)=>item.id?.toString()!);
                // const progress = await ProgressRepository.readAllByGroupWithProjectIds(projectIds)
                const result = projects.map((item) => {
                    return {
                        id: item.id,
                        title: item.title,
                        link: item.link,
                        descripotion: item.description,
                        allocate_budget: item.allocate_budget,
                        budget: item.budget,
                        seted_date: item.seted_date,
                        create_at: item.create_at,
                        publish_at: item.publish_at,
                        total_power: item.total_power,
                        img_url: item.img_url,
                        user_name: item.first_name + " " + item.last_name,
                        city: item.city,
                        state: item.state,
                        country: item.country,
                        total_progress: item.total_progress
                    };
                });
                res.status(200).json({ status: true, projects: result });
            }
            catch (error) {
                res.status(500).json({ status: false, error: error });
            }
        });
        this.setBudget = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { budget, project_id } = req.body;
            if (!budget || !project_id) {
                res.status(200).json({ status: false, message: "Invalid parameter" });
                return;
            }
            const project = yield project_1.default.readById(project_id);
            if (!project) {
                res.status(200).json({ status: false, message: "dont exist project" });
                return;
            }
            try {
                if (project.publish_at) { //check if it is 2days left 
                    let d = new Date();
                    var dateOffset = (24 * 60 * 60 * 1000) * 2; //2 days
                    d.setTime(d.getTime() - dateOffset);
                    if (project.publish_at.getTime() >= d.getTime()) {
                        project.budget = budget;
                        project.seted_date = new Date();
                        const updateProject = yield project_1.default.update(project);
                        res.status(200).json({ status: true, project: updateProject });
                        return;
                    }
                    else {
                        res.status(200).json({ status: false, message: "over editing time" });
                        return;
                    }
                }
                else {
                    project.budget = budget;
                    project.seted_date = new Date();
                    const updateProject = yield project_1.default.update(project);
                    res.status(200).json({ status: true, project: updateProject });
                    return;
                }
            }
            catch (error) {
                return res.status(500).json({ status: false, error: error });
            }
        });
        this.publishProject = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { is_publish, project_id } = req.body;
            if (!is_publish || !project_id) {
                res.status(200).json({ status: false, message: "Invalid parameter" });
                return;
            }
            const project = yield project_1.default.readById(project_id);
            if (!project) {
                res.status(200).json({ status: false, message: "dont exist project" });
                return;
            }
            try {
                if (is_publish === "true") {
                    project.publish_at = new Date();
                    const updateProject = yield project_1.default.update(project);
                    res.status(200).json({ status: true, project: updateProject });
                    return;
                }
                else {
                    const updateProject = yield project_1.default.updateUnPublish(project);
                    res.status(200).json({ status: true, project: updateProject });
                    return;
                }
            }
            catch (err) {
                res.status(500).json({ status: false, error: err });
            }
        });
        this.setExtension = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { url } = req.body;
            if (!url) {
                return res.status(200).json({ status: false, message: "Please input url correctly" });
            }
            try {
                const record = yield extension_1.default.read();
                if (!record) {
                    yield extension_1.default.create(url);
                    return res.status(200).json({ status: true, message: "Createing url is successful" });
                }
                record.url = url;
                yield extension_1.default.update(record);
                return res.status(200).json({ status: true, message: "Updating url is successful" });
            }
            catch (error) {
                return res.status(500).json({ status: false, error: error });
            }
        });
        this.getExtension = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const extenRecord = yield extension_1.default.read();
                if (!extenRecord) {
                    return res.status(200).json({ status: false, message: "There is no url. please register url" });
                }
                const url = extenRecord.url;
                return res.status(200).json({ status: true, url: url });
            }
            catch (err) {
                return res.status(500).json({ status: false, error: err });
            }
        });
        this.delProject = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { project_id } = req.body;
            if (!project_id) {
                res.status(200).json({ status: false, message: "There is no project id" });
                return;
            }
            try {
                const project = yield project_1.default.readById(project_id);
                if (!project) {
                    res.status(200).json({ status: false, message: "There is no project" });
                    return;
                }
                yield project_1.default.remove(project_id);
                return res.status(200).json({ status: true });
            }
            catch (error) {
                console.log("error", error);
                res.status(500).json({ status: false, error: error });
            }
        });
        // updateProject =async (req: Request, res: Response, next: NextFunction)=>{
        //     const {project_id} = req.body;
        //     if(!project_id) {
        //         res.status(200).json({status:false, message:"invalid project id"});
        //     }
        //     const project =await ProjectRepository.readById(project_id);
        //     if(!project){
        //         res.status(200).json({status:false,message:"dont exist project"});
        //     }
        // }
        this.progressProject = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { project_id, allocateBudget } = req.body;
            if (!project_id || !allocateBudget) {
                res.status(200).json({ status: false, message: "invalid params" });
                return;
            }
            try {
                const project = yield project_1.default.readById(project_id);
                if (!project) {
                    res.status(200).json({ status: false, message: "dont exist project" });
                    return;
                }
                if (!project.allocate_budget)
                    project.allocate_budget = 0;
                project.allocate_budget += parseInt(allocateBudget);
                yield project_1.default.update(project);
                // const latestRecord = await ProgressRepository.readLatestRecordByProjectID(project.id!);            
                // let totalProgress:number;
                // console.log("latestRecord",latestRecord);
                // if(latestRecord){
                //     totalProgress = latestRecord!.total_progress*1+allocateBudget*1;
                // }else{
                //     totalProgress = progress_budget*1;
                // }
                // const progressData = ProgressRepository.makeProgressData(project_id,progress_budget,totalProgress,new Date());
                // const progress_data=await ProgressRepository.create(progressData as IProgress);
                res.status(200).json({ status: true, allocateBudget: allocateBudget });
                return;
            }
            catch (error) {
                console.log("error", error);
                res.status(500).json({ status: false, error: error });
            }
        });
        this.notification = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const notificaton = yield notification_1.default.readAll();
                return res.status(200).json({ status: true, notification: notificaton });
            }
            catch (error) {
                res.status(500).json({ status: false, error: error });
                return;
            }
        });
        this.removeNotification = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            console.log("id", id);
            if (!id) {
                res.status(200).json({ status: false, message: "Invalid Record" });
                return;
            }
            const record = yield notification_1.default.remove(id);
            res.status(200).json({ status: true, record: record });
            return;
        });
        this.getAccountType = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const AccountRecords = yield account_type_1.default.readAll();
                return res.status(200).json({ status: true, accounts: AccountRecords });
            }
            catch (error) {
                return res.status(500).json({ status: false, error: error });
            }
        });
        this.setNofitication = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { text, link, category } = req.body;
            if (!text || !category) {
                res.status(200).json({ status: false, message: "Invalid Data" });
                return;
            }
            try {
                const notiData = notification_1.default.makeNotificationData(text, link, category, new Date());
                const createRecord = yield notification_1.default.create(notiData);
                res.status(200).json({ status: true, record: createRecord, message: "Saving notification is successfull" });
                return;
            }
            catch (err) {
                res.status(500).json({ status: false, error: err });
            }
        });
        this.createAccount = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { name, max_count, level } = req.body;
            if (!name || !max_count || !level) {
                return res.status(200).json({ status: false, message: "invalid parameters" });
            }
            try {
                const accountTypeData = account_type_1.default.makeAccountTypeData(name, max_count, level);
                const createAccount = yield account_type_1.default.create(accountTypeData);
                console.log("create Accoount", createAccount);
                return res.status(200).json({ status: true, account: createAccount });
            }
            catch (error) {
                return res.status(500).json({ status: false, error: error });
            }
        });
        this.updateAccount = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id, name, max_count, level } = req.body;
            if (!id || !name || !max_count || !level) {
                return res.status(200).json({ status: false, message: "invalid parameters" });
            }
            try {
                const updateAccount = yield account_type_1.default.readById(id);
                if (!updateAccount) {
                    return res.status(200).json({ status: false, message: "There is no record to update" });
                }
                updateAccount.name = name;
                updateAccount.max_count = max_count;
                updateAccount.level = level;
                const updatedAccount = yield account_type_1.default.update(updateAccount);
                return res.status(200).json({ status: true, record: updatedAccount });
            }
            catch (error) {
                return res.status(500).json({ status: false, error: error });
            }
        });
        this.deleteAccount = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            if (!id) {
                return res.status(200).json({ status: false, message: "Invalid Parametes" });
            }
            try {
                const deleteAccount = yield account_type_1.default.remove(id);
                return res.status(200).json({ status: true, id: deleteAccount });
            }
            catch (error) {
                return res.status(500).json({ status: false, error: error });
            }
        });
        this.saveBack = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const img_url = req['file'].filename;
                if (!img_url) {
                    return res.status(200).json({ status: false, message: "There are no background file" });
                }
                const records = yield background_1.default.readByAll();
                console.log("records", records.length);
                if (records.length) {
                    let backRecord = records[0];
                    backRecord.url = img_url;
                    yield background_1.default.update(backRecord);
                    return res.status(200).json({ status: true, message: "Uploading background is successful" });
                }
                else {
                    const backData = background_1.default.makebackgroundData(img_url);
                    yield background_1.default.create(backData);
                    return res.status(200).json({ status: true, message: "Uploading background is successful" });
                }
            }
            catch (error) {
            }
        });
        this.getUsers = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield users_1.default.readAllUserWithAccountType();
                return res.status(200).json({ status: true, users: users });
            }
            catch (error) {
                return res.status(500).json({ status: false, error: error });
            }
        });
        this.saveLink = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { project_id, link } = req.body;
            if (!project_id || !link) {
                return res.status(200).json({ status: false, message: "please input input parameter correctly!" });
            }
            try {
                const project = yield project_1.default.readById(project_id);
                if (!project) {
                    res.status(200).json({ status: false, message: "There is no cur project" });
                    return;
                }
                project.link = link;
                yield project_1.default.update(project);
                return res.status(200).json({ status: true, message: "Updating link is successful!" });
            }
            catch (error) {
                return res.status(500).json({ status: false, error: error });
            }
        });
        this.getCardList = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const cardList = yield cards_1.default.readAll();
                return res.status(200).json({ status: true, list: cardList });
            }
            catch (error) {
                console.log("error", error);
                return res.status(500).json({ status: false, error: error });
            }
        });
        this.createCard = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id, title, srcStory, link, summary } = req.body;
            const file_name = req['file'].filename;
            if (!title || !srcStory || !link || !summary) {
                res.status(200).json({ status: false, message: "Invalid parameters" });
                return;
            }
            try {
                if (id === "0") {
                    const data = cards_1.default.makeCardData(title, summary, srcStory, link, file_name, new Date());
                    const record = yield cards_1.default.create(data);
                    return res.status(200).json({ status: true, message: "Creating card is Success" });
                }
                else {
                    const cardRecord = yield cards_1.default.readById(id);
                    if (!cardRecord) {
                        return res.status(200).json({ status: false, message: "There is no card" });
                    }
                    const updateData = Object.assign(Object.assign({}, cardRecord), { title,
                        srcStory,
                        summary, source: srcStory, link, img_url: file_name });
                    yield cards_1.default.update(updateData);
                    return res.status(200).json({ status: true });
                }
            }
            catch (error) {
                return res.status(500).json({ status: false, error: error });
            }
        });
        this.updateCard = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id, title, summary, link, srcStory } = req.body;
            if (id === "0") {
                return res.status(200).json({ status: false, message: "Invalid id" });
            }
            try {
                const cardRecord = yield cards_1.default.readById(id);
                if (!cardRecord) {
                    return res.status(200).json({ status: false, message: "There is no card" });
                }
                const data = Object.assign(Object.assign({}, cardRecord), { title,
                    summary,
                    link, source: srcStory });
                yield cards_1.default.update(data);
                return res.status(200).json({ status: true, message: "successful" });
            }
            catch (error) {
                return res.status(500).json({ status: false, error: error });
            }
        });
        this.getCard = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            if (!id || id === "0") {
                return res.status(200).json({ status: false, message: "Invalid Id" });
            }
            try {
                const cardRecord = yield cards_1.default.readById(id);
                if (!cardRecord) {
                    return res.status(200).json({ status: false, message: "There is no card" });
                }
                return res.status(200).json({ status: true, record: cardRecord });
            }
            catch (err) {
                return res.status(500).json({ status: false, error: err });
            }
        });
        this.delCard = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            if (!id || id === "0") {
                return res.status(200).json({ status: false, message: "Invalid Id" });
            }
            try {
                yield cards_1.default.remove(id);
                return res.status(200).json({ status: true });
            }
            catch (err) {
                return res.status(500).json({ status: false, error: err });
            }
        });
        this.cardImg = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const action = req.query.img;
            var filePath = path.join(__dirname, "../../../uploads/cards", action).split("%20").join(" ");
            // var filePath = path.join(__dirname,"../../uploads/profile",action).split("%20").join(" ");
            console.log("file path", filePath);
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
                else if (ext === ".jpg" || ext === ".jpeg") {
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
        });
    }
}
exports.default = AdminController;
//# sourceMappingURL=adminController.js.map