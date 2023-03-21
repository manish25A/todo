import React, { useEffect, useState } from 'react';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Login } from './login';
import { BrowserRouter, Link, Route, Router, Routes } from 'react-router-dom';
import { TodoPage } from './todos';
import { loginContext } from '../utils/loginContext';
import { Register } from './register';

const theme = createTheme();

const MainContainer = () => {
	const [isAuth, setAuth] = useState(false);
	useEffect(() => {
		setAuth(!!localStorage.getItem('token'));
	}, [isAuth]);
	return (
		<loginContext.Provider value={{ isAuth, setAuth }}>
			<ThemeProvider theme={theme}>
				<BrowserRouter>
					<Routes>
						{!isAuth ? (
							<>
								<Route path='/' element={<Login />} />
								<Route path='/register' element={<Register />} />
							</>
						) : (
							<Route path='/' element={<TodoPage />} />
						)}
					</Routes>
				</BrowserRouter>
			</ThemeProvider>
		</loginContext.Provider>
	);
};

export { MainContainer };
