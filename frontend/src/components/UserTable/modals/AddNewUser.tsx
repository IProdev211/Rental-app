import React, { useState } from 'react';
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { DialogTitle, Dialog, Button, Box, Grid, CircularProgress, MenuItem, FormControl, Select, InputLabel, TextField } from '@mui/material';

import { useAlertMessage } from '../../../hooks/useAlertMessage';
import { addNewUser } from '../../../redux/reducers/userReducer';
import { auth } from '../../../firebase';

interface ComponentProps {
  open: boolean;
  onClose: () => void;
}

const AddNewUserModal: React.FC<ComponentProps> = (props) => {
  const dispatch = useDispatch()
  const { onClose, open } = props;
  const { showAlertMessage } = useAlertMessage();
  const [loading, setLoading] = useState<boolean>(false)

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setLoading(true)

    axios.post(`${process.env.REACT_APP_API_URL}/user/add`, {
      user: {
        email: formData.get('email'),
        password: formData.get('password'),
        role: formData.get('role'),
        name: formData.get('name'),
      },
    }).then(({ data }) => {
      if (data.success) {
        dispatch(addNewUser(data.newUser))
        showAlertMessage('New user is created succssfully!', { variant: 'success' });
        onClose()
      } else {
        showAlertMessage(`Creating a user is failed! (${data.error})`, {
          variant: 'error',
        });
      }
    }).catch((err) => {
      console.log(err)
      showAlertMessage(`Creating a user is failed (${err?.message || ''})`, {
        variant: 'error',
      });
    }).finally(() => {
      setLoading(false)
    })
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth>
      <DialogTitle>Add a new user</DialogTitle>
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 4, pt: 0 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
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
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Role</InputLabel>
              <Select
                label="Role"
                name="role"
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
              </Select>
            </FormControl>
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
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={6}>
              <Button
                onClick={handleClose}
                fullWidth
                variant="outlined"
                disabled={loading}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
              >
                {loading ? (<CircularProgress size={24} color="warning" />) : <span>Add</span>}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
}

export default AddNewUserModal