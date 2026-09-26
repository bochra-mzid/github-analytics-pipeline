import { useState } from 'react';

import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
} from '@mui/material';

import { useContributors } from '../hooks/useMetrics';

function ContributorsTable() {
	const { data, isLoading, error } = useContributors();

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	if (isLoading) {
		return <div>Loading contributors...</div>;
	}

	if (error) {
		return <div>Failed to load contributors.</div>;
	}

	const contributors = data ?? [];
	const paginatedContributors = contributors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

	const handleChangePage = (_event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<Paper>
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Contributor</TableCell>
							<TableCell align="right">Total Created</TableCell>
							<TableCell align="right">PRs Created</TableCell>
							<TableCell align="right">Issues Created</TableCell>
							<TableCell align="right">PRs Merged</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{paginatedContributors.map((contributor) => (
							<TableRow key={contributor.login}>
								<TableCell sx={{ py: 1 }}>{contributor.login}</TableCell>
								<TableCell align="right" sx={{ py: 1 }}>
									{contributor.total_created}
								</TableCell>
								<TableCell align="right" sx={{ py: 1 }}>
									{contributor.prs_created}
								</TableCell>
								<TableCell align="right" sx={{ py: 1 }}>
									{contributor.issues_created}
								</TableCell>
								<TableCell align="right" sx={{ py: 1 }}>
									{contributor.prs_merged}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<TablePagination
				component="div"
				count={contributors.length}
				page={page}
				onPageChange={handleChangePage}
				rowsPerPage={rowsPerPage}
				onRowsPerPageChange={handleChangeRowsPerPage}
				rowsPerPageOptions={[5, 10, 25]}
			/>
		</Paper>
	);
}

export default ContributorsTable;
