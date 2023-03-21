import { UserInterface } from '../interface/User.interface';
import { HttpError } from '../utils/HTTPError';
import { isEmpty } from '../utils/utils';
import userModel from '../models/User.model';
import { UserLoginValidator, UserValidator } from '@utils/Validators';
import { hash, compare } from 'bcrypt';
import { logger } from '@utils/logger';
import { DataStoredInToken, TokenData } from '@interface/Auth.interface';
import { sign } from 'jsonwebtoken';
class AuthService {
	private users = userModel;
	constructor() {}

	public async signup(userData: UserValidator): Promise<UserInterface> {
		if (isEmpty(userData)) throw new HttpError(400, 'userData is empty');

		const findUser: UserInterface = await this.users.findOne({
			email: userData.email,
		});
		if (findUser)
			throw new HttpError(409, `This email ${userData.email} already exists`);

		const hashedPassword = await hash(userData.password, 10);
		const createUserData: UserInterface = await this.users.create({
			...userData,
			password: hashedPassword,
		});

		return createUserData;
	}

	public async login(
		userData: UserLoginValidator
	): Promise<{ token: string; findUser: UserInterface }> {
		if (isEmpty(userData)) throw new HttpError(400, 'userData is empty');

		const findUser: UserInterface = await this.users
			.findOne({
				email: userData.email,
			})
			.select('password');
		if (!findUser)
			throw new HttpError(409, `This email ${userData.email} was not found`);

		console.log(userData.password, findUser.password);
		const isPasswordMatching: boolean = await compare(
			userData.password,
			findUser.password
		);
		if (!isPasswordMatching) throw new HttpError(409, 'Wrong password');

		const tokenData = this.createToken(findUser);
		const token = this.createCookie(tokenData);

		return { token, findUser };
	}
	public createToken(user: UserInterface): TokenData {
		const dataStoredInToken: DataStoredInToken = { _id: user._id };
		const secretKey: string = 'SECRET_KEY';
		const expiresIn: number = 60 * 60;

		return {
			token: sign(dataStoredInToken, secretKey, { expiresIn }),
		};
	}

	public createCookie(tokenData: TokenData): string {
		return `Authorization=${tokenData.token}`;
	}
}
export default AuthService;
