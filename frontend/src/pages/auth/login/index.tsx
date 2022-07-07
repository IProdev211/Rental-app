import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import {
  signInWithEmailAndPassword
} from 'firebase/auth';
import { Button, Box, TextField, Container, Avatar, Typography, Grid, Link } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { auth } from '../../../firebase';
import { useAlertMessage } from '../../../hooks/useAlertMessage';
import { setLoggedIn } from '../../../redux/reducers/authReducer';
// import { getUserInfo } from '../../../redux/reducers/authReducer';

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showAlertMessage } = useAlertMessage();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        navigate('/');
      }
    });
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      const userData = await signInWithEmailAndPassword(
        auth,
        data.get('email') as string,
        data.get('password') as string
      );
      axios.get(`${process.env.REACT_APP_API_URL}/user?id=${userData.user.uid}`).then(({ data }) => {
        if (data.success) {
          dispatch(setLoggedIn({
            id: userData.user.uid,
            ...data.user
          }))
        }
      })
      const idToken = await auth.currentUser?.getIdToken();
      localStorage.setItem('token', idToken as string);
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + idToken;

      navigate('/')
      showAlertMessage('Logged in succssfully!', { variant: 'success' });
    } catch (err: any) {
      showAlertMessage(`Login is failed (${err?.code || ''})`, {
        variant: 'error',
      });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
