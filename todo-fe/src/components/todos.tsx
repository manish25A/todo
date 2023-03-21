import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import { useQuery } from 'react-query';
import { Button, LinearProgress, Stack } from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { UpdateModal } from './updateModal';
import { AxiosInstance } from '../utils/axiosInterceptor';
import { loginContext } from '../utils/loginContext';

interface Data {
	_id: string;
	name: string;
	type: string;
	successRate: string;
	actions: string;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
	order: Order,
	orderBy: Key
): (
	a: { [key in Key]: number | string },
	b: { [key in Key]: number | string }
) => number {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(
	array: readonly T[],
	comparator: (a: T, b: T) => number
) {
	const stabilizedThis = array?.map((el, index) => [el, index] as [T, number]);
	stabilizedThis?.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) {
			return order;
		}
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'name',
		numeric: false,
		disablePadding: false,
		label: 'Name',
	},
	{
		id: 'type',
		numeric: false,
		disablePadding: false,
		label: 'Type',
	},
	{
		id: 'successRate',
		numeric: false,
		disablePadding: false,
		label: 'Success Rate (%)',
	},
	{
		id: 'actions',
		numeric: false,
		disablePadding: false,
		label: 'Actions',
	},
];

interface EnhancedTableProps {
	onRequestSort: (
		event: React.MouseEvent<unknown>,
		property: keyof Data
	) => void;
	order: Order;
	orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
	const { order, orderBy, onRequestSort } = props;
	const createSortHandler =
		(property: keyof Data) => (event: React.MouseEvent<unknown>) => {
			onRequestSort(event, property);
		};

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'right' : 'center'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component='span' sx={visuallyHidden}>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

export const TodoPage = () => {
	const [order, setOrder] = React.useState<Order>('asc');
	const [orderBy, setOrderBy] = React.useState<keyof Data>('name');
	const [selected, setSelected] = React.useState<readonly string[]>([]);
	const [page, setPage] = React.useState(0);
	const [dense, setDense] = React.useState(false);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const [editModal, setEditModalOpen] = React.useState(false);
	const [id, setId] = React.useState('');
	const fetchTodos = async () => {
		return await AxiosInstance.get('/list-all-todo');
	};
	const { isLoading, data, error } = useQuery('list-all-todo', fetchTodos);

	const rows: any = data?.data?.data ?? [];

	const handleRequestSort = (
		event: React.MouseEvent<unknown>,
		property: keyof Data
	) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const isSelected = (name: string) => selected.indexOf(name) !== -1;

	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

	const handleEditClick = (event: any) => {
		setId(event.target.value);
		setEditModalOpen(true);
	};
	const closeEditModal = () => {
		setEditModalOpen(false);
	};
	const handleDeleteClick = async (event: any) => {
		console.log(event.target.value);
		await AxiosInstance.delete('/delete-todo', {
			params: { _id: event.target.value },
		})
			.then((res) => {
				if (res.status === 200) {
					const index = rows.findIndex((x: any) => x._id === res.data.data._id);
					console.log(index);
					rows.splice(index, 1);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handleChangedData = (event: any) => {
		const updatedDataIndex = rows.findIndex(
			(x: any) => x._id === event.data._id
		);
		rows[updatedDataIndex] = event.data;
	};
	const handleSavedData = (event: any) => {
		rows.push(event.data);
	};
	const { isAuth, setAuth } = useContext(loginContext);

	const handleLogout = () => {
		localStorage.removeItem('token');
		setAuth(false);
	};

	function EnhancedTableToolbar() {
		return (
			<Toolbar
				sx={{
					pl: { sm: 2 },
					pr: { xs: 1, sm: 1 },
				}}
			>
				<Typography
					sx={{ flex: '1 1 100%' }}
					variant='h6'
					id='tableTitle'
					component='div'
				>
					Todo List
				</Typography>

				<Typography
					sx={{ flex: '1 1 1 25%' }}
					marginRight={'20px'}
					variant='h6'
					id='tableTitle'
					component='div'
				>
					<Button
						variant='contained'
						onClick={(event) => handleEditClick(event)}
						endIcon={<Add />}
						size='small'
					>
						Add Todo
					</Button>
				</Typography>
				<Typography
					sx={{ flex: '1 1 1 5%' }}
					variant='h6'
					id='tableTitle'
					component='div'
				>
					<Button
						variant='contained'
						onClick={(event) => handleLogout()}
						size='small'
					>
						Logout
					</Button>
				</Typography>
			</Toolbar>
		);
	}
	return (
		<>
			{isLoading ? (
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
				<>
					<Box sx={{ width: '100%' }}>
						<Paper sx={{ width: '100%', mb: 2 }}>
							<EnhancedTableToolbar />
							<TableContainer>
								<Table
									sx={{ minWidth: 750 }}
									aria-labelledby='tableTitle'
									size={dense ? 'small' : 'medium'}
								>
									<EnhancedTableHead
										order={order}
										orderBy={orderBy}
										onRequestSort={handleRequestSort}
									/>
									<TableBody>
										{stableSort(rows, getComparator(order, orderBy))
											.slice(
												page * rowsPerPage,
												page * rowsPerPage + rowsPerPage
											)
											.map((row, index) => {
												return (
													<TableRow hover tabIndex={-1} key={index}>
														<TableCell align='center'>{row.name}</TableCell>
														<TableCell align='center'>{row.type}</TableCell>
														<TableCell align='center'>
															{row.successRate}
														</TableCell>
														<TableCell align='center'>
															<Button
																value={row._id}
																variant='contained'
																onClick={(event) => handleEditClick(event)}
																endIcon={<Edit />}
																size='small'
															>
																Edit
															</Button>
															<Button
																value={row._id}
																variant='outlined'
																startIcon={<Delete />}
																onClick={handleDeleteClick}
																size='small'
															>
																Delete
															</Button>
														</TableCell>
													</TableRow>
												);
											})}
										{emptyRows > 0 && (
											<TableRow
												style={{
													height: (dense ? 33 : 53) * emptyRows,
												}}
											>
												<TableCell colSpan={6}>{'No data'}</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</TableContainer>
							<TablePagination
								rowsPerPageOptions={[5, 10, 25]}
								component='div'
								count={rows.length}
								rowsPerPage={rowsPerPage}
								page={page}
								onPageChange={handleChangePage}
								onRowsPerPageChange={handleChangeRowsPerPage}
							/>
						</Paper>
					</Box>
					<UpdateModal
						id={id}
						modalState={editModal}
						handleClose={closeEditModal}
						handleUpdatedData={handleChangedData}
						handleSavedData={handleSavedData}
					/>
				</>
			)}
		</>
	);
};
