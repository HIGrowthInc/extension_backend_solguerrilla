import { Router } from 'express';
import mailChecker from '../middlewares/mailChecker';
import forgotMailChecker from '../middlewares/forgotMailChecker';
import AuthController from "../controllers/authController";

import getUpload from "../utils/multer"
import { VerifyUser } from '../utils/refreshToken';
import * as cors from 'cors';
const uploadProfile = getUpload("/profile");
class AuthRouter {
public router = Router();
    authController = new AuthController();

    constructor() {
        this.initializeRoutes();
    }
    
    initializeRoutes() {
        this.router.route('/mail_verify').post(this.authController.mailVerify);
        this.router.route("/forgot_mail").post(forgotMailChecker,this.authController.forgotMail);
        this.router.route('/signup').post(mailChecker,this.authController.signUp);
        this.router.route('/success').get(this.authController.success);
        this.router.route('/update_profile').post(this.authController.updateProfile);        
        this.router.route ('/create_profile').post(uploadProfile.single('img_file'),this.authController.create_profile);
        this.router.route('/signin').post(this.authController.signIn);
        this.router.route('/profile').post(VerifyUser,this.authController.profile)
        this.router.route('/profileImg').get(this.authController.getProfileImg);
        this.router.route('/logout').post(VerifyUser,this.authController.logOut);
        this.router.route("/getBack").post(this.authController.getBackground);
        this.router.route("/back").get(this.authController.backImg);
        this.router.route("/setNewPassword").post(this.authController.setNewPassword);
    }
}

export default AuthRouter;