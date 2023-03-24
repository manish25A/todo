import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { DataStoredInToken, UserRequest } from '@interface/Auth.interface';
import userModel from '@models/User.model';
import { HttpError } from '@utils/HTTPError';
import { logger } from '@utils/logger';

const authMiddleware = async (
	req: UserRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		console.log(req.header('token').split('Authorization=')[1]);
		const Authorization = req.header('token')
			? req.header('token').split('Authorization=')[1]
			: null;
		if (Authorization) {
			const secretKey: string = 'SECRET_KEY';
			const verificationResponse = (await verify(
				Authorization,
				secretKey
			)) as DataStoredInToken;
			logger.info(verificationResponse);
			const userId = verificationResponse._id;
			const findUser = await userModel.findById(userId);

			if (findUser) {
				req.user = findUser;
				next();
			} else {
				next(new HttpError(401, 'Wrong authentication token1'));
			}
		} else {
			next(new HttpError(404, 'Authentication token missing'));
		}
	} catch (error) {
		next(new HttpError(401, 'Wrong authentication token'));
	}
};

export default authMiddleware;
