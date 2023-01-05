"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = require("../utils/passport");
const adminController_1 = require("../controllers/adminController");
const adminChecker_1 = require("../middlewares/adminChecker");
const multer_1 = require("../utils/multer");
const uploadBackground = (0, multer_1.default)("/background");
const uploadCard = (0, multer_1.default)("/cards");
class AdminRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.adminController = new adminController_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.route('/login').get(this.adminController.login);
        this.router.route('/login').post(this.adminController.adminLogin);
        this.router.route('/getProjects').post(passport_1.default.authenticate("jwt"), adminChecker_1.default, this.adminController.dashboard);
        this.router.route('/publish').post(passport_1.default.authenticate("jwt"), adminChecker_1.default, this.adminController.publishProject);
        this.router.route('/set_budget').post(passport_1.default.authenticate("jwt"), adminChecker_1.default, this.adminController.setBudget);
        this.router.route('/del_project').post(passport_1.default.authenticate("jwt"), adminChecker_1.default, this.adminController.delProject);
        this.router.route('/progress').post(passport_1.default.authenticate("jwt"), adminChecker_1.default, this.adminController.progressProject);
        this.router.route('/get_notification').post(passport_1.default.authenticate("jwt"), adminChecker_1.default, this.adminController.notification);
        this.router.route('/notification').post(passport_1.default.authenticate("jwt"), adminChecker_1.default, this.adminController.setNofitication);
        this.router.route('/getProfile').post(passport_1.default.authenticate("jwt"), adminChecker_1.default, this.adminController.getProfile);
        this.router.route('/rm_notification').post(passport_1.default.authenticate('jwt'), adminChecker_1.default, this.adminController.removeNotification);
        this.router.route("/accountType").post(passport_1.default.authenticate('jwt'), adminChecker_1.default, this.adminController.getAccountType);
        this.router.route("/creatAccount").post(passport_1.default.authenticate('jwt'), adminChecker_1.default, this.adminController.createAccount);
        this.router.route("/updateAccount").post(passport_1.default.authenticate('jwt'), adminChecker_1.default, this.adminController.updateAccount);
        this.router.route("/deleteAccount").post(passport_1.default.authenticate('jwt'), adminChecker_1.default, this.adminController.deleteAccount);
        this.router.route("/getUsers").post(passport_1.default.authenticate('jwt'), adminChecker_1.default, this.adminController.getUsers);
        this.router.route("/saveLink").post(passport_1.default.authenticate('jwt'), adminChecker_1.default, this.adminController.saveLink);
        this.router.route("/create_back").post(passport_1.default.authenticate('jwt'), adminChecker_1.default, uploadBackground.single("img_file"), this.adminController.saveBack);
        this.router.route("/getExtension").post(this.adminController.getExtension);
        this.router.route("/setExtension").post(passport_1.default.authenticate('jwt'), adminChecker_1.default, this.adminController.setExtension);
        this.router.route('/create_card').post(passport_1.default.authenticate("jwt"), adminChecker_1.default, uploadCard.single('img_file'), this.adminController.createCard);
        this.router.route('/updateCard').post(passport_1.default.authenticate("jwt"), adminChecker_1.default, this.adminController.updateCard);
        this.router.route("/getCard").post(this.adminController.getCard);
        this.router.route("/deleteCard").post(passport_1.default.authenticate("jwt"), adminChecker_1.default, this.adminController.delCard);
        this.router.route("/getCardList").post(this.adminController.getCardList);
        this.router.route('/cardImg').get(this.adminController.cardImg);
        // when click accept button on
    }
}
exports.default = AdminRouter;
//# sourceMappingURL=adminRouter.js.map