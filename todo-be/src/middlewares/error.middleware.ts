import { NextFunction, Request, Response } from 'express';
import { logger } from '@utils/logger';
import { HttpError } from '../utils/HTTPError';

const errorMiddleware = (
	error: HttpError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const status: number = error.status || 500;
		const message: string = error.message || 'Something went wrong';

		logger.error(
			`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`
		);
		res.status(status).json({ status, message });
	} catch (error) {
		next(error);
	}
};

export default errorMiddleware;
