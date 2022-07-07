import { Stack, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useMemo } from 'react'
import Moment from 'react-moment'
import { useDispatch, useSelector } from 'react-redux'
import { setReserves } from '../../redux/reducers/reserveReducer'
import { RootState } from '../../redux/store'
import { TableColumn } from '../../types'
import DataTable from '../Table'

const ReserveTable = () => {
  const dispatch = useDispatch()
  const { reserves } = useSelector((state: RootState) => state.reserve)

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/reserve`).then(({ data }) => {
      if (data.success) {
        dispatch(setReserves(data.reserves))
      }
    })
  }, [])


  const userColumns: TableColumn[] = useMemo(
    () => [
      { id: 'name', label: 'Name', align: 'left' },
      {
        id: 'from',
        label: 'From',
      },
      {
        id: 'to',
        label: 'To',
      }
    ],
    []
  );


  const bikeColumns: TableColumn[] = useMemo(
    () => [
      { id: 'bike', label: 'Bike', align: 'left' },
      {
        id: 'from',
        label: 'From',
      },
      {
        id: 'to',
        label: 'To',
      }
    ],
    []
  );

  const userRows: any[] = reserves.map((reserve) => ({
    name: reserve.user?.name || '',
    from: <Moment format="DD MMMM YYYY">{reserve.from}</Moment>,
    to: <Moment format="DD MMMM YYYY">{reserve.to}</Moment>
  }))

  const bikeRows: any[] = reserves.map((reserve) => ({
    bike: `${reserve.bike?.model || ''}-${reserve.bike?.color || ''}-${reserve.bike?.location || ''}`,
    from: <Moment format="DD MMMM YYYY">{reserve.from}</Moment>,
    to: <Moment format="DD MMMM YYYY">{reserve.to}</Moment>
  }))

  return (
    <Stack direction="row" spacing={4}>
      <Stack width="calc(50% - 16px)">
        <Typography fontSize={20} fontWeight={700}>Reserve Users</Typography>
        <DataTable
          columns={userColumns}
          rows={userRows}
        />
      </Stack>
      <Stack width="calc(50% - 16px)">
        <Typography fontSize={20} fontWeight={700}>Reserved Bikes</Typography>
        <DataTable
          columns={bikeColumns}
          rows={bikeRows}
        />
      </Stack>
    </Stack>
  )
}

export default ReserveTable