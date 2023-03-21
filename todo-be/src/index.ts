import express from 'express';
import morgan, { Morgan } from 'morgan';
import { logger, stream } from './utils/logger';
import { DBConnection } from '@utils/db';
import helmet from 'helmet';
import cors from 'cors';
import AuthRoute from '@routes/Auth.routes';
import { Routes } from '@interface/Routes.interface';
import errorMiddleware from '@middlewares/error.middleware';

class App {
	public app: express.Application;
	public port: number;

	constructor(routes: Routes[]) {
		this.app = express();
		this.port = 3000;
		this.initializeMiddleWares();
		new DBConnection();
		this.initializeRoutes(routes);
		this.initializeErrorHandling();
	}

	public listen() {
		this.app.listen(this.port, () => {
			logger.info('server running on port %s', this.port);
		});
	}
	private initializeMiddleWares() {
		this.app.use(morgan('dev', { stream }));
		this.app.use(cors({ origin: '*' }));
		this.app.use(helmet());
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
	}

	private initializeRoutes(routes: Routes[]) {
		routes.forEach((route) => {
			this.app.use('/', route.router);
		});
	}
	private initializeErrorHandling() {
		this.app.use(errorMiddleware);
	}
}
export default App;
