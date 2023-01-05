"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usersController_1 = require("../controllers/usersController");
class UsersRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.usersController = new usersController_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.route('/check_user/:address').get(this.usersController.checkUser);
        this.router.route('/register').get(this.usersController.checkUser);
        // this.router.route('/user_info').get(passport.authenticate('jwt', { session: false }), this.usersController.checkAdmin, this.usersController.getUserInfo);
        // this.router.route('/get_profile/:address').get(this.usersController.getProfile);
        // this.router.route('/update_profile/:address').post(this.usersController.updateProfile);
    }
}
exports.default = new UsersRouter().router;
//# sourceMappingURL=usersRouter.js.map