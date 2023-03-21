import { NextFunction, Request, Response } from 'express';
import AuthService from '@services/Auth.service';
import { UserLoginValidator, UserValidator } from '@utils/Validators';
import { UserInterface } from '@interface/User.interface';

class AuthController {
	public authService = new AuthService();

	public signUp = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userData: UserValidator = await req.body;
			const signUpUserData: UserInterface = await this.authService.signup(
				userData
			);

			res.status(201).json({ data: signUpUserData, message: 'signup' });
		} catch (error) {
			next(error);
		}
	};

	public logIn = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userData: UserLoginValidator = req.body;
			const { token, findUser } = await this.authService.login(userData);

			res.setHeader('Set-Cookie', [token]);
			res.status(200).json({ data: findUser, message: 'login', token });
		} catch (error) {
			next(error);
		}
	};
}

export default AuthController;
