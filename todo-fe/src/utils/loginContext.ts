import { createContext } from 'react';

const loginContext = createContext({
	isAuth: false,
	setAuth: (auth: boolean) => {},
});

export { loginContext };
