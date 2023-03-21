import axios from 'axios';

const instance = axios.create({
	baseURL: 'http://localhost:3000',
});

instance.interceptors.request.use(
	(config) => {
		const tokenData = localStorage.getItem('token');
		if (tokenData) {
			config.headers.token = tokenData;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

instance.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response.status === 401) {
			localStorage.removeItem('token');
			window.location.href = '/';
		}
		return Promise.reject(error);
	}
);

export { instance as AxiosInstance };
