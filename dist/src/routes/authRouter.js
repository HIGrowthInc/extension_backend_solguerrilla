"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mailChecker_1 = require("../middlewares/mailChecker");
const forgotMailChecker_1 = require("../middlewares/forgotMailChecker");
const authController_1 = require("../controllers/authController");
const multer_1 = require("../utils/multer");
const refreshToken_1 = require("../utils/refreshToken");
const uploadProfile = (0, multer_1.default)("/profile");
class AuthRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.authController = new authController_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.route('/mail_verify').post(this.authController.mailVerify);
        this.router.route("/forgot_mail").post(forgotMailChecker_1.default, this.authController.forgotMail);
        this.router.route('/signup').post(mailChecker_1.default, this.authController.signUp);
        this.router.route('/success').get(this.authController.success);
        this.router.route('/update_profile').post(this.authController.updateProfile);
        this.router.route('/create_profile').post(uploadProfile.single('img_file'), this.authController.create_profile);
        this.router.route('/signin').post(this.authController.signIn);
        this.router.route('/profile').post(refreshToken_1.VerifyUser, this.authController.profile);
        this.router.route('/profileImg').get(this.authController.getProfileImg);
        this.router.route('/logout').post(refreshToken_1.VerifyUser, this.authController.logOut);
        this.router.route("/getBack").post(this.authController.getBackground);
        this.router.route("/back").get(this.authController.backImg);
        this.router.route("/setNewPassword").post(this.authController.setNewPassword);
    }
}
exports.default = AuthRouter;
//# sourceMappingURL=authRouter.js.map