"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const projectController_1 = require("../controllers/projectController");
const passport_1 = require("../utils/passport");
const multer_1 = require("../utils/multer");
const uploadProject = (0, multer_1.default)("/project");
class ProjectRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.projectController = new projectController_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.route('/create_project').post(uploadProject.single("img_file"), passport_1.default.authenticate('jwt'), authMiddleware_1.default, this.projectController.submitProject);
        this.router.route('/support').post(passport_1.default.authenticate("jwt"), authMiddleware_1.default, this.projectController.support);
        this.router.route('/projectImg').get(this.projectController.getProjectImg);
        this.router.route("/detail").get(this.projectController.getProject);
        this.router.route('/get_projects').post(this.projectController.getProjects);
        this.router.route("/getProjectForAny").post(this.projectController.getProjectsForAny);
    }
}
exports.default = ProjectRouter;
//# sourceMappingURL=projectRouter.js.map