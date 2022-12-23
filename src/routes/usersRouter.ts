import { Router } from 'express';
import UsersController from '../controllers/usersController';
import passport from '../utils/passport';

class UsersRouter {
  router = Router();
  usersController = new UsersController();

  constructor() {
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

export default new UsersRouter().router;
