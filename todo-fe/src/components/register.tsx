import React, { FormEvent, createContext, useContext, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { loginContext } from '../utils/loginContext';
import { SnackbarComponent } from '../common/snackbar';

export const Register = () => {
	const navigate = useNavigate();
	const [openSnackbar, setOpenSnackBar] = useState(false);
	const [message, setMessage] = useState('');
	const [severity, setSeverity] = useState('');
	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const registerForm = new FormData(event.currentTarget);
		const signupData = {
			name: registerForm.get('name'),
			email: registerForm.get('email'),
			password: registerForm.get('password'),
		};
		loginRequest(signupData);
	};

	const loginRequest = async (signupData: any) => {
		try {
			const response = await axios
				.post('http://localhost:3000/signup', signupData)
				.then((res) => {
					if (res.data) {
						navigate('/');
						setOpenSnackBar(true);
						setMessage('Registered successfully');
						setSeverity('success');
					}
				})
				.catch((err) => {
					console.log(err);
				});
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			<Grid container component='main' sx={{ height: '100vh' }}>
				<CssBaseline />
				<Grid
					item
					xs={false}
					sm={4}
					md={7}
					sx={{
						backgroundImage: 'url(https://source.unsplash.com/random)',
						backgroundRepeat: 'no-repeat',
						backgroundColor: (t) =>
							t.palette.mode === 'light'
								? t.palette.grey[50]
								: t.palette.grey[900],
						backgroundSize: 'cover',
						backgroundPosition: 'center',
					}}
				/>
				<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
					<Box
						sx={{
							position: 'center',
							my: 8,
							mx: 4,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
							<LockOutlinedIcon />
						</Avatar>
						<Typography component='h1' variant='h5'>
							Register{' '}
						</Typography>
						<Box
							component='form'
							noValidate
							onSubmit={handleSubmit}
							sx={{ mt: 1 }}
						>
							<TextField
								margin='normal'
								required
								fullWidth
								id='name'
								label='Name'
								name='name'
								autoComplete='name'
								autoFocus
							/>
							<TextField
								margin='normal'
								required
								fullWidth
								id='email'
								label='Email Address'
								name='email'
								autoComplete='email'
								autoFocus
							/>
							<TextField
								margin='normal'
								required
								fullWidth
								name='password'
								label='Password'
								type='password'
								id='password'
								autoComplete='current-password'
							/>

							<Button
								type='submit'
								fullWidth
								variant='outlined'
								sx={{ mt: 3, mb: 2 }}
							>
								Sign In
							</Button>
							<Grid container>
								<Grid item>
									<Link to='/'>{'Alreadyhave an account? Login'}</Link>
								</Grid>
							</Grid>
						</Box>
					</Box>
				</Grid>
			</Grid>
			<SnackbarComponent
				remoteOpen={openSnackbar}
				severity={severity}
				message={message}
			/>
		</>
	);
};
