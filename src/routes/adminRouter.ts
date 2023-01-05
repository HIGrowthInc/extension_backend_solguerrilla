import { Router } from 'express';
import passport from '../utils/passport';
import AdminController from '../controllers/adminController';
import adminChecker from '../middlewares/adminChecker';
import getUpload from '../utils/multer';

const uploadBackground = getUpload("/background");
const uploadCard = getUpload("/cards");
class AdminRouter {

public router = Router();
    adminController = new AdminController();

    constructor() {
        this.initializeRoutes();
    }
    
    initializeRoutes() {
        this.router.route('/login').get(this.adminController.login);
        this.router.route('/login').post(this.adminController.adminLogin)
        this.router.route('/getProjects').post(passport.authenticate("jwt"),adminChecker,this.adminController.dashboard);
        this.router.route('/publish').post(passport.authenticate("jwt"),adminChecker,this.adminController.publishProject)
        this.router.route('/set_budget').post(passport.authenticate("jwt"),adminChecker,this.adminController.setBudget);
        this.router.route('/del_project').post(passport.authenticate("jwt"),adminChecker,this.adminController.delProject);
        this.router.route('/progress').post(passport.authenticate("jwt"),adminChecker,this.adminController.progressProject);
        this.router.route('/get_notification').post(passport.authenticate("jwt"),adminChecker,this.adminController.notification);
        this.router.route('/notification').post(passport.authenticate("jwt"),adminChecker,this.adminController.setNofitication);
        this.router.route('/getProfile').post(passport.authenticate("jwt"),adminChecker,this.adminController.getProfile);
        this.router.route('/rm_notification').post(passport.authenticate('jwt'),adminChecker,this.adminController.removeNotification);
        this.router.route("/accountType").post(passport.authenticate('jwt'),adminChecker,this.adminController.getAccountType);
        this.router.route("/creatAccount").post(passport.authenticate('jwt'),adminChecker,this.adminController.createAccount);
        this.router.route("/updateAccount").post(passport.authenticate('jwt'),adminChecker,this.adminController.updateAccount);
        this.router.route("/deleteAccount").post(passport.authenticate('jwt'),adminChecker,this.adminController.deleteAccount);
        this.router.route("/updateAccountRole").post(passport.authenticate('jwt'),adminChecker,this.adminController.updateAccountRole);
        this.router.route("/getUsers").post(passport.authenticate('jwt'),adminChecker,this.adminController.getUsers)
        this.router.route("/saveLink").post(passport.authenticate('jwt'),adminChecker,this.adminController.saveLink);
        this.router.route("/create_back").post(passport.authenticate('jwt'),adminChecker,uploadBackground.single("img_file"),this.adminController.saveBack)
        this.router.route("/getExtension").post(this.adminController.getExtension);
        this.router.route("/setExtension").post(passport.authenticate('jwt'),adminChecker,this.adminController.setExtension);
        this.router.route('/create_card').post(passport.authenticate("jwt"),adminChecker,uploadCard.single('img_file'),this.adminController.createCard);
        this.router.route('/updateCard').post(passport.authenticate("jwt"),adminChecker,this.adminController.updateCard);
        this.router.route("/getCard").post(this.adminController.getCard);
        this.router.route("/deleteCard").post(passport.authenticate("jwt"),adminChecker,this.adminController.delCard);
        this.router.route("/getCardList").post(this.adminController.getCardList);
        this.router.route('/cardImg').get(this.adminController.cardImg);
        // when click accept button on
        
    }
}

export default AdminRouter;