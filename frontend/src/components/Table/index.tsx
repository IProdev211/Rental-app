import * as React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TablePagination,
  TableRow,
  styled,
  Typography,
} from '@mui/material';
import { TableColumn } from '../../types';

type DataTableProps = {
  columns: TableColumn[];
  rows: any[];
  handleChangeAction?: (id: string, val: any) => void;
  handlePage?: (arg: number) => void;
};

const Container = styled(Paper)`
  box-shadow: none;
  & .MuiTablePagination-selectLabel {
    visibility: hidden;
  }
  & .MuiInputBase-root {
    visibility: hidden;
  }
`;

export default function DataTable({
  columns,
  rows,
  handleChangeAction,
  handlePage,
}: DataTableProps) {
  const rowsPerPage = 10;
  const [page, setPage] = React.useState(0);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    if (handlePage) {
      handlePage(newPage);
    }
  };

  return (
    <Container sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns
                .map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          {rows.length > 0 && (
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, _i) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={_i}>
                      {columns
                        .map((column, _j) => {
                          // @ts-ignore
                          const value = row[column.id];
                          return (
                            <TableCell
                              key={_j}
                              align={column.align}
                            >
                              {column.format && typeof value === 'number'
                                ? column.format(value)
                                : column.format && column.label === 'Action'
                                  ? column.format({
                                    status: value,
                                    setStatus: (a: any) =>
                                      handleChangeAction &&
                                      handleChangeAction(row.id, a),
                                  })
                                  : typeof value === 'function'
                                    ? value()
                                    : value}
                            </TableCell>
                          );
                        })}
                    </TableRow>
                  );
                })}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      {rows.length <= 0 && (
        <Typography
          width="100%"
          mt={8}
          fontWeight={500}
          color="#A3A1A1"
          textAlign="center"
        >
          NO DATA AVAILABLE
        </Typography>
      )}
      {rows.length > 0 && (
        <TablePagination
          component="div"
          count={rows.length}
          rowsPerPage={20}
          page={page}
          onPageChange={handleChangePage}
        />
      )}
    </Container>
  );
}
