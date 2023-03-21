import AuthController from '@controllers/Auth.controller';
import { Routes } from '@interface/Routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { UserLoginValidator, UserValidator } from '@utils/Validators';
import { Router } from 'express';

class AuthRoute implements Routes {
	public path = '/';
	public router = Router();
	public authController = new AuthController();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post(
			`${this.path}signup`,
			validationMiddleware(UserValidator, 'body'),
			this.authController.signUp
		);
		this.router.post(
			`${this.path}login`,
			validationMiddleware(UserLoginValidator, 'body'),
			this.authController.logIn
		);
		// this.router.post(
		// 	`${this.path}logout`,
		// 	authMiddleware,
		// 	this.authController.logOut
		// );
	}
}

export default AuthRoute;
