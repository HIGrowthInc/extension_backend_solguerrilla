"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inviteController_1 = require("../controllers/inviteController");
const inviteChecker_1 = require("../middlewares/inviteChecker");
class InviteRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.inviteController = new inviteController_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.route('/').post(this.inviteController.invite_mail);
        // when click accept button on
        this.router.route('/accept').post(inviteChecker_1.default, this.inviteController.invite_accept);
        this.router.route('/sign_up').post(inviteChecker_1.default, this.inviteController.signUp);
        this.router.route('/mail_verify/').post(this.inviteController.invite_mailVerify);
    }
}
exports.default = InviteRouter;
//# sourceMappingURL=inviteRouter.js.map