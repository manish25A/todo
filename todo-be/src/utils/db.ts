import mongoose from 'mongoose';
import { logger } from './logger';
import dotenv from 'dotenv';
dotenv.config();
const DB_URI =
	process.env.DB_URI ?? 'mongodb://root:password@localhost:27017/nimbuzz-todo';

export class DBConnection {
	constructor() {
		mongoose
			.connect(DB_URI)
			.then(() => {
				logger.info('Mongo DB Connected Successfully');
			})
			.catch(() => {
				logger.error('Mongo DB Connection failed');
			});
		mongoose.connection.on('error', (err) => {
			logger.error(err);
		});
	}
}
