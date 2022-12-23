import { Application } from 'express';
import * as path from "path";
import adminChecker from 'src/middlewares/adminChecker';
import AdminRouter from './adminRouter';
import AuthRouter from './authRouter';
import InviteRouter from './inviteRouter';
import ProjectRouter from './projectRouter';

const express = require('express');
export default class Routes {
  public authRouter = new AuthRouter();
  public inviteRouter = new InviteRouter();
  public adminRouter = new AdminRouter();
  public projectRouter = new ProjectRouter();
  constructor(app: Application) {
    // auth routes
    // app.use(express.static(path.resolve(__dirname , '../../../google-extension-admin-front/build')));
    app.use('/auth/create_profile', express.static(__dirname + '/../uploads'));
    app.use('/auth/profileImg/:id',express.static(__dirname + '/../uploads'))
    app.use('/auth', this.authRouter.router);

    //invite routes
    
    app.use('/invite',this.inviteRouter.router);
    app.use('/project',this.projectRouter.router);
    app.use('/admin',this.adminRouter.router);
  }
}
