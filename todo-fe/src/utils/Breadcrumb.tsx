import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';

function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
	event.preventDefault();
	console.info('You clicked a breadcrumb.');

	console.log(event.target);
}

export default function Breadcrumb() {
	return (
		<Breadcrumbs aria-label='breadcrumb'>
			<Link
				to='/'
				style={{
					textDecoration: 'none',
				}}
			>
				<Typography color='inherit'>Todo List</Typography>
			</Link>

			<Link
				to='/completion-table'
				aria-current='page'
				style={{
					textDecoration: 'none',
				}}
			>
				<Typography color='inherit'>Completion Table</Typography>
			</Link>
		</Breadcrumbs>
	);
}
