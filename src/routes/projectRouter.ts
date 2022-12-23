import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import ProjectController from '../controllers/projectController';
import passport from '../utils/passport';
import getUpload from '../utils/multer';
const uploadProject = getUpload("/project")
class ProjectRouter {
public router = Router();
    projectController = new ProjectController();

    constructor() {
        this.initializeRoutes();
    }
    
    initializeRoutes() {
        this.router.route('/create_project').post(uploadProject.single("img_file"),passport.authenticate('jwt'),authMiddleware,this.projectController.submitProject);
        this.router.route('/support').post(passport.authenticate("jwt"),authMiddleware,this.projectController.support)
        this.router.route('/projectImg').get(this.projectController.getProjectImg);
        this.router.route("/detail").get(this.projectController.getProject);
        this.router.route('/get_projects').post(this.projectController.getProjects);
        this.router.route("/getProjectForAny").post(this.projectController.getProjectsForAny);
    }
}

export default ProjectRouter;