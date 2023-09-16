import { FC } from 'react';

import { format } from '@/utils';

import { RowsPaginated } from '@/components';
import { LoadDataTables } from '@/components/ui'
import { Table, TableHead, TableRow, TableBody, TableFooter, TablePagination, TableCell, TableContainer, Typography, styled, Paper } from '@mui/material'
import { PaginationData } from '@/interfaces';


const CustomPaper = styled(Paper)((props) => ({
    background: "#1d1b1b",
    backdropFilter: "blur(10px)",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
}));

interface Props {
    results: PaginationData,
    isLoading?: boolean,
    headRows: string[],
    totalText?: string,
    hiddenTotal?: boolean,
    handleChangePage: (event: unknown, newPage: number) => void
}

export const CustomTable: FC<Props> = ({ handleChangePage, isLoading, results, headRows, totalText, hiddenTotal = false }) => {

    return (
        <TableContainer component={CustomPaper}>
            <Table>
                <TableHead>
                    <TableRow>
                        {headRows.map(text => (
                            <TableCell key={text} sx={{ fontWeight: 'bold' }} align="center"> {text} </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {
                        isLoading
                            ? <LoadDataTables />
                            : <RowsPaginated rows={results.rows} page={results.page} />
                    }
                </TableBody>

                <TableFooter>
                    <TableRow>
                        <TablePagination
                            colSpan={6}
                            count={results.totalRows}
                            rowsPerPage={10}
                            rowsPerPageOptions={[]}
                            page={results.page}
                            onPageChange={handleChangePage}
                        />
                    </TableRow>
                </TableFooter>
            </Table>


            <Typography variant="h5" fontWeight='bold' textAlign='center' m={3} display={!hiddenTotal ? '' : 'none'}>
                {totalText}
                <Typography component='span' fontWeight='bold' variant="h5" color="primary.main" ml={1}>
                    {results.totalAmount}
                </Typography>
            </Typography>

        </TableContainer>
    )
}