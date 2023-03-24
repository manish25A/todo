import React, { lazy, Suspense, useEffect, useState } from 'react';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Login } from './login';
import { BrowserRouter, Link, Route, Router, Routes } from 'react-router-dom';
import { loginContext } from '../utils/loginContext';
import { LinearProgress, Stack } from '@mui/material';
import { Loading } from '../utils/Loading';
import CompletionTable from './CompletionRate';
import Breadcrumb from '../utils/Breadcrumb';

const Register = lazy(() => import('./register'));
const TodoPage = lazy(() => import('./todos'));
// import TodoPage from './todos';
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
					{isAuth && <Breadcrumb />}
					<Stack>
						<Routes>
							{!isAuth ? (
								<>
									<Route path='/' element={<Login />} />
									<Route path='/register' element={<Register />} />
								</>
							) : (
								<>
									<Route
										path='/'
										element={
											<Suspense fallback={<Loading />}>
												<TodoPage />
											</Suspense>
										}
									/>
									<Route
										path='/completion-table'
										element={
											<Suspense fallback={<Loading />}>
												<CompletionTable />
											</Suspense>
										}
									/>
								</>
							)}
						</Routes>
					</Stack>
				</BrowserRouter>
			</ThemeProvider>
		</loginContext.Provider>
	);
};

export { MainContainer };
