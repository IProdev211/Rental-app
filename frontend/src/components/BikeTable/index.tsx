import * as React from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { alpha } from '@mui/material/styles';
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
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { visuallyHidden } from '@mui/utils';
import { Rating } from '@mui/material'

import { TBike } from '../../types';
import AddNewBikeModal from './modals/AddNewBike'
import { updateBike, deleteBikes } from '../../redux/reducers/bikeReducer';
import { useAlertMessage } from '../../hooks/useAlertMessage';
import EditBikeModal from './modals/EditBike';

type Data = TBike & { action?: string }
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
    id: 'model',
    numeric: false,
    disablePadding: true,
    label: 'Model',
  },
  {
    id: 'color',
    numeric: false,
    disablePadding: false,
    label: 'Color',
  },
  {
    id: 'location',
    numeric: false,
    disablePadding: false,
    label: 'Location',
  },
  {
    id: 'rating',
    numeric: false,
    disablePadding: false,
    label: 'Rating',
  },
  {
    id: 'isForRental',
    numeric: false,
    disablePadding: false,
    label: 'Is For Rental?',
  },
  {
    id: 'action',
    numeric: false,
    disablePadding: false,
    label: '',
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
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

interface EnhancedTableToolbarProps {
  numSelected: number;
  onClickAdd: () => void
  onClickDelete: () => void
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { numSelected, onClickAdd, onClickDelete } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          fontWeight={700}
        >
          Bikes
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={onClickDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="New bike">
          <IconButton onClick={onClickAdd} >
            <AddIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

export default function BikeTable({ bikes }: { bikes: TBike[] }) {
  const dispatch = useDispatch()
  const { showAlertMessage } = useAlertMessage()
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('model');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openAddNewBikeModal, setOpenAddNewBikeModal] = React.useState<boolean>(false)
  const [openEditBikeModal, setOpenEditBikeModal] = React.useState<boolean>(false)
  const [selectedBike, setSelectedBike] = React.useState<TBike | undefined>()

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = bikes.map((n) => n.id as string);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.ChangeEvent<HTMLInputElement>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenAddBike = () => {
    setOpenAddNewBikeModal(true)
  }

  const handleOpenEditBike = (bike: TBike) => {
    setSelectedBike(bike)
    setOpenEditBikeModal(true)
  }

  const handleDeleteBikes = () => {
    const delbikes = bikes.filter((bike) => selected.includes(bike.id))
    axios.delete(`${process.env.REACT_APP_API_URL}/bike/delete`, {
      data: { bikes: delbikes }
    }).then(({ data }) => {
      if (data.success) {
        dispatch(deleteBikes(selected))
        setSelected([])
        showAlertMessage('Deleted successfully!', { variant: 'success' })
      }
    })
  }

  const handleUpdateRental = (bike: TBike) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBike = {
      ...bike,
      isForRental: e.target.checked
    }
    axios.put(`${process.env.REACT_APP_API_URL}/bike/edit`, {
      bike: newBike
    }).then(({ data }) => {
      if (data.success) {
        dispatch(updateBike(newBike))
        showAlertMessage('Updated the bike successfully!', { variant: 'success' })
      }
    })
  }

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - bikes.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%' }}>
        <EnhancedTableToolbar numSelected={selected.length} onClickAdd={handleOpenAddBike} onClickDelete={handleDeleteBikes} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size='small'
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={bikes.length}
            />
            <TableBody>
              {
                //@ts-ignore
                bikes.slice().sort(getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                            onChange={(event) => handleClick(event, row.id)}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.model}
                        </TableCell>
                        <TableCell align="left">{row.color}</TableCell>
                        <TableCell align="left">{row.location}</TableCell>
                        <TableCell align="left"><Rating name="read-only" value={row.rating} readOnly /></TableCell>
                        <TableCell align="left">{
                          <Checkbox checked={row.isForRental} onChange={handleUpdateRental(row)} />
                        }</TableCell>
                        <TableCell>
                          <Tooltip title="Edit a bike">
                            <IconButton onClick={() => handleOpenEditBike(row)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip></TableCell>
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
          count={bikes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <AddNewBikeModal
        open={openAddNewBikeModal}
        onClose={() => setOpenAddNewBikeModal(false)}
      />
      <EditBikeModal
        bike={selectedBike as TBike}
        open={Boolean(selectedBike) && openEditBikeModal}
        onClose={() => setOpenEditBikeModal(false)}
      />
    </Box>
  );
}
