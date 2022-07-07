import * as React from 'react';
import axios, { AxiosResponse } from 'axios';
import { useDispatch, useSelector } from 'react-redux';
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
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { DateRangePicker, DateRange } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';

import { AxiosResponseType, TBike } from '../../types';
import { Button, FormControl, InputLabel, MenuItem, Rating, Select, SelectChangeEvent, Stack, TextField } from '@mui/material';
import { RootState } from '../../redux/store';
import ReserveBikeModal from './modals/ReserveBike';
import { setAvailableBikes } from '../../redux/reducers/bikeReducer';

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

const EnhancedTableToolbar = ({ filterSetting, setFilterSetting }: any) => {
  const { constants } = useSelector(
    (state: RootState) => state.bike
  );

  const handleChange = (field: string) => (e: SelectChangeEvent) => {
    const newSetting = {
      ...filterSetting,
      [field]: e.target.value
    }

    setFilterSetting(newSetting)
  }

  const handleChangePeriod = (value: DateRange<Date>) => {
    const newSetting = {
      ...filterSetting,
      from: value[0] ? new Date(value[0] as Date).getTime() : null,
      to: value[1] ? new Date(value[1] as Date).getTime() : null,
    }
    setFilterSetting(newSetting)
  }

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
        Bikes
      </Typography>
      <Stack direction="row" spacing={2} ml={10} justifyContent="space-between">
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          localeText={{ start: 'From', end: 'To' }}
        >
          <DateRangePicker
            value={[filterSetting.from || null, filterSetting.to || null]}
            onChange={(newValue) => {
              handleChangePeriod(newValue);
            }}
            renderInput={(startProps, endProps) => (
              <React.Fragment>
                <TextField {...startProps} />
                <Box sx={{ mx: 2 }}> to </Box>
                <TextField {...endProps} />
              </React.Fragment>
            )}
          />
        </LocalizationProvider>
        <FormControl sx={{ minWidth: '100px' }}>
          <InputLabel>Model</InputLabel>
          <Select
            label="Model"
            name="model"
            value={filterSetting.model}
            onChange={handleChange('model')}
          >
            <MenuItem value={''}><em>--select--</em></MenuItem>
            {
              (constants.models || []).map((model) => (
                <MenuItem value={model} key={model}>{model}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: '100px' }}>
          <InputLabel>Color</InputLabel>
          <Select
            label="Color"
            name="color"
            value={filterSetting.color}
            onChange={handleChange('color')}
          >
            <MenuItem value={''}><em>--select--</em></MenuItem>
            {
              (constants.colors || []).map((color) => (
                <MenuItem value={color} key={color}>{color}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: '100px' }}>
          <InputLabel>Location</InputLabel>
          <Select
            label="Location"
            name="location"
            value={filterSetting.location}
            onChange={handleChange('location')}
          >
            <MenuItem value={''}><em>--select--</em></MenuItem>
            {
              (constants.locations || []).map((location) => (
                <MenuItem value={location} key={location}>{location}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: '100px' }}>
          <InputLabel>Rating</InputLabel>
          <Select
            label="Rating"
            name="rating"
            value={filterSetting.rating}
            onChange={handleChange('rating')}
          >
            <MenuItem value={''}><em>--select--</em></MenuItem>
            {
              (new Array(6).fill(0)).map((rate, _i) => (
                <MenuItem value={_i} key={_i}>{_i}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </Stack>
    </Toolbar>
  );
};

export default function CustomerBikeTable() {
  const dispatch = useDispatch()
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('model');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [selectedBike, setSelectedBike] = React.useState<string | undefined>()
  const [openReserveBikeModal, setOpenReserveBikeModal] = React.useState<boolean>(false)
  const [filterSetting, setFilterSetting] = React.useState<Record<string, any>>({
    from: null,
    to: null
  })
  const { availableBikes: bikes } = useSelector((state: RootState) => state.bike)

  React.useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/bike/filter`, {
      params: { ...filterSetting }
    }).then(({ data }: AxiosResponse<AxiosResponseType>) => {
      if (data.success) {
        dispatch(setAvailableBikes(data.bikes))
      }
    })
  }, [filterSetting])

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

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - bikes.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%' }}>
        <EnhancedTableToolbar filterSetting={filterSetting} setFilterSetting={setFilterSetting} />
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
                bikes.slice().sort(getComparator(order, orderBy))
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
                          {row.model}
                        </TableCell>
                        <TableCell align="left">{row.color}</TableCell>
                        <TableCell align="left">{row.location}</TableCell>
                        <TableCell align="left"><Rating name="read-only" value={row.rating} readOnly />
                        </TableCell>
                        <TableCell align="right" width="100px">
                          <Button
                            onClick={() => {
                              setSelectedBike(row.id)
                              setOpenReserveBikeModal(true)
                            }}
                          >
                            Reserve
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
          count={bikes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <ReserveBikeModal
        bike={selectedBike as string}
        open={Boolean(selectedBike) && openReserveBikeModal}
        onClose={() => setOpenReserveBikeModal(false)}
        onSubmitted={() => {
          dispatch(setAvailableBikes([...bikes.filter(b => b.id !== selectedBike)]))
          setFilterSetting({ from: null, to: null })
        }}
      />
    </Box>
  );
}
