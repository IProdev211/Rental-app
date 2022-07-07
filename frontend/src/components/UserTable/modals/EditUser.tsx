import React, { useState } from 'react';
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { DialogTitle, Dialog, Button, Box, Grid, CircularProgress, MenuItem, FormControl, Select, InputLabel, TextField } from '@mui/material';

import { useAlertMessage } from '../../../hooks/useAlertMessage';
import { updateUser } from '../../../redux/reducers/userReducer';
import { TUser } from '../../../types';

interface ComponentProps {
  user: TUser
  open: boolean;
  onClose: () => void;
}

const EditUserModal: React.FC<ComponentProps> = (props) => {
  const dispatch = useDispatch()
  const { onClose, open, user } = props;
  const { showAlertMessage } = useAlertMessage();
  const [loading, setLoading] = useState<boolean>(false)

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setLoading(true)

    axios.put(`${process.env.REACT_APP_API_URL}/user/edit`, {
      user: {
        ...user,
        email: formData.get('email'),
        role: formData.get('role'),
        name: formData.get('name'),
      }
    }).then(({ data }) => {
      if (data.success) {
        dispatch(updateUser({
          ...user,
          email: formData.get('email'),
          role: formData.get('role'),
        }))
        showAlertMessage('The user is updataed succssfully!', { variant: 'success' });
        onClose()
      } else {
        showAlertMessage(`Updating a user is failed! (${data.error})`, {
          variant: 'error',
        });
      }
    }).catch((err) => {
      showAlertMessage(`Updating a user is failed (${err?.message || ''})`, {
        variant: 'error',
      });
    }).finally(() => {
      setLoading(false)
    })
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth>
      <DialogTitle>Edit a user</DialogTitle>
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
              defaultValue={user?.name}
              autoFocus
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Role</InputLabel>
              <Select
                label="Role"
                name="role"
                defaultValue={user?.role}
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
              defaultValue={user?.email}
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
                {loading ? (<CircularProgress size={24} color="warning" />) : <span>Submit</span>}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Dialog >
  );
}

export default EditUserModal