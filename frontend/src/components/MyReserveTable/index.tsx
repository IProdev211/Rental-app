import * as React from 'react';
import axios, { AxiosResponse } from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Moment from 'react-moment'
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

import { AxiosResponseType, TReserve } from '../../types';
import { useAlertMessage } from '../../hooks/useAlertMessage';
import { Button } from '@mui/material';
import { RootState } from '../../redux/store';
import CancelReserveModal from './modals/CancelReserve';
import { cancelMyReserve, setMyReserves } from '../../redux/reducers/reserveReducer';
import { addNewAvailableBike } from '../../redux/reducers/bikeReducer';

type Data = TReserve & { action?: string }
type Order = 'asc' | 'desc';
interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
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

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
    a: { [key in Key]: boolean | number | string },
    b: { [key in Key]: boolean | number | string },
  ) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}


const headCells: readonly HeadCell[] = [
  {
    id: 'bike',
    numeric: false,
    disablePadding: true,
    label: 'Bike',
  },
  {
    id: 'from',
    numeric: false,
    disablePadding: false,
    label: 'From',
  },
  {
    id: 'to',
    numeric: false,
    disablePadding: false,
    label: 'To',
  },
  {
    id: 'action',
    numeric: false,
    disablePadding: false,
    label: '',
  },
];

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } =
    props;
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
            align={headCell.numeric ? 'right' : 'left'}
            padding={'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
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

const EnhancedTableToolbar = () => {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        mb: 2,
        display: 'flex',
        justifyContent: 'space-between'
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
      >
        My Reserves
      </Typography>
    </Toolbar>
  );
};

export default function CustomerBikeTable() {
  const dispatch = useDispatch()
  const { showAlertMessage } = useAlertMessage()
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('bike');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [selectedReserve, setSelectedReserve] = React.useState<string | undefined>()
  const [openCancelReserveModal, setOpenCancelReserveModal] = React.useState<boolean>(false)
  const [cancelLoading, setCancelLoading] = React.useState<boolean>(false)
  const { userInfo } = useSelector((state: RootState) => state.auth)
  const { myReserves } = useSelector((state: RootState) => state.reserve)

  React.useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/reserve/mine`, {
      params: { id: userInfo.id }
    }).then(({ data }: AxiosResponse<AxiosResponseType>) => {
      if (data.success) {
        dispatch(setMyReserves(data.reserves))
      }
    })
  }, [userInfo])

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCancelReserve = (rate: number) => {
    setCancelLoading(true)
    const reserveObj = myReserves.find((r) => r.id === selectedReserve)
    axios.delete(`${process.env.REACT_APP_API_URL}/reserve`, {
      data: { id: selectedReserve, bike: reserveObj?.bike?.id, user: reserveObj?.user?.id, newRating: rate }
    }).then(({ data }) => {
      if (data.success) {
        const newBike = data.bike
        dispatch(addNewAvailableBike(newBike))
        dispatch(cancelMyReserve(selectedReserve))
        setOpenCancelReserveModal(false)
        showAlertMessage('Canceled a reserve successfully!', { variant: 'success' })
      }
    }).finally(() => {
      setCancelLoading(false)
    })
  }

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - myReserves.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%' }}>
        <EnhancedTableToolbar />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size='small'
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {
                //@ts-ignore
                myReserves.slice().sort(getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        tabIndex={-1}
                        key={row.id}
                      >
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                        >
                          {`${row.bike?.model}-${row.bike?.color}-${row.bike?.location}`}
                        </TableCell>
                        <TableCell align="left"><Moment format="DD MMMM YYYY">{row.from}</Moment></TableCell>
                        <TableCell align="left"><Moment format="DD MMMM YYYY">{row.to}</Moment></TableCell>
                        <TableCell align="right" width="200px">
                          <Button
                            onClick={() => {
                              setSelectedReserve(row.id)
                              setOpenCancelReserveModal(true)
                            }}
                          >
                            Cancel Reserve
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={myReserves.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <CancelReserveModal
        loading={cancelLoading}
        open={Boolean(selectedReserve) && openCancelReserveModal}
        onClose={() => setOpenCancelReserveModal(false)}
        onSubmit={handleCancelReserve}
      />
    </Box>
  );
}
