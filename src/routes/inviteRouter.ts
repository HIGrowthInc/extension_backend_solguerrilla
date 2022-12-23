import { Router } from 'express';
import passport from '../utils/passport';
import mailChecker from '..//middlewares/mailChecker';
import InviteController from '../controllers/inviteController';

import inviteChecker from '../middlewares/inviteChecker';
class InviteRouter {
public router = Router();
    inviteController = new InviteController();

    constructor() {
        this.initializeRoutes();
    }
    
    initializeRoutes() {
        this.router.route('/').post(this.inviteController.invite_mail);
        // when click accept button on
        this.router.route('/accept').post(inviteChecker,this.inviteController.invite_accept);
        this.router.route('/sign_up').post(inviteChecker,this.inviteController.signUp)
        this.router.route('/mail_verify/').post(this.inviteController.invite_mailVerify);
    }
}

export default InviteRouter;