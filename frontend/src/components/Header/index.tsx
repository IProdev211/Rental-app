import React, { useEffect } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

import { auth } from '../../firebase';
import { setLoggedIn } from '../../redux/reducers/authReducer';
import { RootState } from '../../redux/store';

const MainLayout: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      const { pathname } = window.location;
      if (!user) {
        if (pathname !== '/') sessionStorage.setItem('pathName', pathname);
        navigate('/login');
      }
    });
  }, []);

  useEffect(() => {
    const idToken = localStorage.getItem('token')
    if (idToken && idToken !== 'undefined') {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + idToken;
      axios.post(`${process.env.REACT_APP_API_URL}/signInWithToken`, {
        idToken
      }).then(({ data }) => {
        dispatch(setLoggedIn(data.user))
      }).catch(() => {
        auth.signOut()
        navigate('/login')
      })
    }
  }, [])

  useEffect(() => {
    auth.onIdTokenChanged(async function (user) {
      const idToken = await user?.getIdToken();
      localStorage.setItem('token', idToken as string);
    });
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/login')
  };

  return (
    <Stack direction="row" alignItems="center" justifyContent="end" p={4}>
      <Stack>
        <Typography fontWeight={700}>{`${userInfo.name || ''} - ${userInfo.role || ''}`}</Typography>
        <Typography fontSize="0.75em">({userInfo.email})</Typography>
      </Stack>
      <Stack ml={4}>
        <Button variant="outlined" size="small" onClick={handleSignOut}>Sign Out</Button>
      </Stack>
    </Stack>
  );
};

export default MainLayout