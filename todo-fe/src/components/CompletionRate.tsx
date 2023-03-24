import React, { useContext, useEffect } from 'react';
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
import { Loading } from '../utils/Loading';

interface Data {
	_id: any;
	completionRate: string;
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
		id: '_id',
		numeric: false,
		disablePadding: false,
		label: 'Date',
	},
	{
		id: 'completionRate',
		numeric: false,
		disablePadding: false,
		label: 'Completion Rate(%)',
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

function TableHeadProps(props: EnhancedTableProps) {
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

export default function CompletionTable() {
	const [order, setOrder] = React.useState<Order>('asc');
	const [orderBy, setOrderBy] = React.useState<keyof Data>('completionRate');
	const [page, setPage] = React.useState(0);
	const [dense, setDense] = React.useState(false);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const fetchCompletedTodos = async () => {
		return await AxiosInstance.get('/completed-todo');
	};
	const { isLoading, data, error } = useQuery(
		'completed-todo',
		fetchCompletedTodos
	);

	const rows: any = data?.data?.data[0]?.percentages ?? [];

	console.log(rows);
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

	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

	return (
		<>
			{isLoading ? (
				<Loading />
			) : (
				<>
					<Box sx={{ width: '100%' }}>
						<Paper sx={{ width: '100%', mb: 2 }}>
							<TableContainer>
								<Table
									sx={{ minWidth: 750 }}
									aria-labelledby='tableTitle'
									size={dense ? 'small' : 'medium'}
								>
									<TableHeadProps
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
														<TableCell align='center'>
															{row?._id?.creationDate}
														</TableCell>
														<TableCell align='center'>
															{row.completionRate}
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
				</>
			)}
		</>
	);
}
