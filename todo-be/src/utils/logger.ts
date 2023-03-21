import pino from 'pino';

export const logger = pino({
	transport: {
		target: 'pino-pretty',
	},
	options: {
		colorize: true,
	},
});
export const stream = {
	write: (message: string) => {
		logger.info(message.substring(0, message.lastIndexOf('\n')));
	},
};
