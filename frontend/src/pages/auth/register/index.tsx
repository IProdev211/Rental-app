import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Box, TextField, Container, Avatar, Typography, Grid, Link } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios'

import { useAlertMessage } from '../../../hooks/useAlertMessage';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { showAlertMessage } = useAlertMessage();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const email = (data.get('email') as string).trim()
    const password = data.get('password')
    const name = (data.get('name') as string).trim()

    if (!email || !password || !name) {
      showAlertMessage('Please fill in the required fields', { variant: 'error' })
      return
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/signup`, {
        userInfo: {
          email,
          password,
          name
        }
      })

      navigate('/login')
      showAlertMessage('Registered succssfully!', { variant: 'success' });
    } catch (err: any) {
      showAlertMessage(`Register is failed (${err?.code || ''})`, {
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
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                label="Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}

export default RegisterPage