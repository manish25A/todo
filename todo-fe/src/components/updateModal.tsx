import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { LinearProgress, Stack, TextField } from '@mui/material';
import axios from 'axios';
import { useQuery } from 'react-query';
import { AxiosInstance } from '../utils/axiosInterceptor';
import { SnackbarComponent } from '../common/snackbar';

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

type propsTypes = {
	id: string;
	modalState: boolean;
	handleClose: () => void;
	handleUpdatedData: (event: any) => void;
	handleSavedData: (event: any) => void;
};

type inputTypes = {
	_id?: string;
	name: string;
	type: string;
	successRate: string;
};
export const UpdateModal = (props: propsTypes) => {
	const [inputs, setInputs] = useState<inputTypes>({
		_id: '',
		name: '',
		type: '',
		successRate: '',
	});
	const [loading, setLoading] = useState(false);
	const [openSnackbar, setOpenSnackBar] = useState(false);
	const [message, setMessage] = useState('');
	const [severity, setSeverity] = useState('');
	// if (props.modalState) {
	const fetchTodos = async () => {
		return await AxiosInstance.get(`/get-single-todo`, {
			params: {
				_id: props.id,
			},
		});
	};
	const { isLoading, data, error } = useQuery(
		['fetchOneQuery', props.id],
		fetchTodos,
		{
			enabled: !!props.id,
		}
	);

	useEffect(() => {
		if (data) {
			setLoading(isLoading);
			setInputs(data?.data?.data);
		}
	}, [data]);
	// }
	const handleChange = (event: any) => {
		const name = event.target.name;
		const value = event.target.value;
		setInputs((values: any) => ({ ...values, [name]: value }));
	};

	const handleSubmit = async (event: any) => {
		event.preventDefault();
		if (inputs?._id) {
			return await AxiosInstance.put(`/update-todo`, inputs)
				.then((res) => {
					if (res.status === 200) {
						props.handleClose();
						props.handleUpdatedData(res.data);
						setOpenSnackBar(true);
						setMessage('Todo Updated successfully');
						setSeverity('success');
					}
				})
				.catch((err) => {
					setOpenSnackBar(true);
					setMessage(err.response.data.message);
					setSeverity('error');
				});
		} else {
			delete inputs?._id;
			return await AxiosInstance.post(`/createtodo`, inputs)
				.then((res) => {
					console.log(res.status);
					if (res.status === 201) {
						props.handleClose();
						props.handleSavedData(res.data);
						setOpenSnackBar(true);
						setMessage('Todo Saved successfully');
						setSeverity('success');
					}
				})
				.catch((err) => {
					setOpenSnackBar(true);
					setMessage(err.response.data.message);
					setSeverity('error');
					console.log(err);
				});
		}
	};

	return (
		<>
			{loading ? (
				<>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
						}}
					>
						<Stack
							sx={{
								width: '40vw',
								color: 'grey.500',
								height: '90vh',
								justifyContent: 'center',
							}}
							spacing={2}
						>
							<LinearProgress color='secondary' />
							<LinearProgress color='success' />
							<LinearProgress color='inherit' />
						</Stack>
					</div>
				</>
			) : (
				<div>
					<Modal
						open={props.modalState}
						onClose={props.handleClose}
						aria-labelledby='modal-modal-title'
						aria-describedby='modal-modal-description'
					>
						<Box component='form' noValidate onSubmit={handleSubmit} sx={style}>
							{props.id ? <h1>Update form</h1> : <h1>Add Todo</h1>}
							<TextField
								margin='normal'
								required
								fullWidth
								id='name'
								label='Todo Name'
								name='name'
								autoComplete='todo name'
								autoFocus
								value={inputs?.name}
								onChange={handleChange}
							/>
							<TextField
								margin='normal'
								required
								fullWidth
								name='type'
								label='Type'
								id='type'
								autoComplete='type'
								value={inputs?.type}
								onChange={handleChange}
							/>
							<TextField
								margin='normal'
								required
								fullWidth
								name='successRate'
								label='Success Rate'
								id='successRate'
								autoComplete='Success Rate'
								value={inputs?.successRate}
								onChange={handleChange}
							/>

							<Button
								type='submit'
								fullWidth
								variant='contained'
								sx={{ mt: 3, mb: 2 }}
							>
								{props.id ? <h1>Update </h1> : <h1>Add</h1>}
							</Button>
						</Box>
					</Modal>
					<SnackbarComponent
						remoteOpen={openSnackbar}
						severity={severity}
						message={message}
					/>
				</div>
			)}
		</>
	);
};
