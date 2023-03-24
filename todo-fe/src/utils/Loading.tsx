import { LinearProgress, Stack } from '@mui/material';

export const Loading = () => {
	return (
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
	);
};
