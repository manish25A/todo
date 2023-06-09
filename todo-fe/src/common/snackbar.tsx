import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
	props,
	ref
) {
	return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

export const SnackbarComponent = ({ remoteOpen, message, severity }: any) => {
	const [open, setOpen] = React.useState(false);

	const handleClose = (
		event?: React.SyntheticEvent | Event,
		reason?: string
	) => {
		console.log(reason);
		if (reason === 'clickaway') {
			return;
		}

		setOpen(false);
	};

	return (
		<Stack spacing={2} sx={{ width: '100%' }}>
			<Snackbar open={remoteOpen} autoHideDuration={6000} onClose={handleClose}>
				<Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
					{message}
				</Alert>
			</Snackbar>
		</Stack>
	);
};
