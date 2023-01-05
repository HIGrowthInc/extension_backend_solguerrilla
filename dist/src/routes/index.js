"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adminRouter_1 = require("./adminRouter");
const authRouter_1 = require("./authRouter");
const inviteRouter_1 = require("./inviteRouter");
const projectRouter_1 = require("./projectRouter");
const express = require('express');
class Routes {
    constructor(app) {
        this.authRouter = new authRouter_1.default();
        this.inviteRouter = new inviteRouter_1.default();
        this.adminRouter = new adminRouter_1.default();
        this.projectRouter = new projectRouter_1.default();
        // auth routes
        // app.use(express.static(path.resolve(__dirname , '../../../google-extension-admin-front/build')));
        app.use('/auth/create_profile', express.static(__dirname + '/../uploads'));
        app.use('/auth/profileImg/:id', express.static(__dirname + '/../uploads'));
        app.use('/auth', this.authRouter.router);
        //invite routes
        app.use('/invite', this.inviteRouter.router);
        app.use('/project', this.projectRouter.router);
        app.use('/admin', this.adminRouter.router);
    }
}
exports.default = Routes;
//# sourceMappingURL=index.js.map