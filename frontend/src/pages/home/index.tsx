import React, { useEffect } from 'react'
import axios, { AxiosResponse } from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { Stack } from '@mui/material'

import BikeTable from '../../components/BikeTable'
import { setBikes, setConstants } from '../../redux/reducers/bikeReducer'
import { AxiosResponseType, TUser } from '../../types'
import { RootState } from '../../redux/store'
import UserTable from '../../components/UserTable'
import { setUsers } from '../../redux/reducers/userReducer'
import CustomerBikeTable from '../../components/CustomerBikeTable'
import MyReserveTable from '../../components/MyReserveTable'
import ReserveTable from '../../components/ReserveTable'

const HomePage: React.FC = () => {
  const dispatch = useDispatch()
  const { isLoggedIn } = useSelector((state: RootState) => state.auth)
  const { bikes } = useSelector((state: RootState) => state.bike)
  const { users } = useSelector((state: RootState) => state.user)
  const { userInfo } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (!isLoggedIn) return;

    axios.get(`${process.env.REACT_APP_API_URL}/constants`).then(({ data }: AxiosResponse<AxiosResponseType>) => {
      if (data.success) {
        dispatch(setConstants({
          colors: data.data[0],
          locations: data.data[1],
          models: data.data[2],
        }))
      }
    })

    if (userInfo.role === 'manager') {
      axios.get(`${process.env.REACT_APP_API_URL}/bike/getAll`).then(({ data }: AxiosResponse<AxiosResponseType>) => {
        if (data.success) {
          dispatch(setBikes(data.bikes))
        }
      })
      axios.get(`${process.env.REACT_APP_API_URL}/user/getAll`).then(({ data }: AxiosResponse<AxiosResponseType>) => {
        if (data.success) {
          dispatch(setUsers(data.users))
        }
      })
    }
  }, [isLoggedIn, userInfo])

  if (isLoggedIn && userInfo.role === 'manager') {
    return (
      <Stack spacing={4} maxWidth="lg" margin="auto" mb={10}>
        <BikeTable bikes={bikes} />
        <UserTable users={users.filter((user: TUser) => user.id !== userInfo.id)} />
        <ReserveTable />
      </Stack>
    )
  }

  if (isLoggedIn && userInfo.role === 'user') {
    return (
      <Stack spacing={4} maxWidth="lg" margin="auto">
        <CustomerBikeTable />
        <MyReserveTable />
      </Stack>
    )
  }

  return null
}

export default HomePage