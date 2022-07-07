import React, { useState } from 'react';
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { DialogTitle, Dialog, Button, Box, Grid, CircularProgress, MenuItem, FormControl, Select, InputLabel } from '@mui/material';

import { useAlertMessage } from '../../../hooks/useAlertMessage';
import { RootState } from '../../../redux/store';
import { addNewBike } from '../../../redux/reducers/bikeReducer';

interface ComponentProps {
  open: boolean;
  onClose: () => void;
}

const AddNewBikeModal: React.FC<ComponentProps> = (props) => {
  const dispatch = useDispatch()
  const { onClose, open } = props;
  const { showAlertMessage } = useAlertMessage();
  const [loading, setLoading] = useState<boolean>(false)

  const { constants } = useSelector(
    (state: RootState) => state.bike
  );

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setLoading(true)

    axios.post(`${process.env.REACT_APP_API_URL}/bike/add`, {
      bike: {
        model: formData.get('model'),
        location: formData.get('location'),
        color: formData.get('color'),
      }
    }).then(({ data }) => {
      if (data.success) {
        dispatch(addNewBike(data.newBike))
        showAlertMessage('New bike is created succssfully!', { variant: 'success' });
        onClose()
      } else {
        showAlertMessage(`Creating a bike is failed!`, {
          variant: 'error',
        });
      }
    }).catch((err) => {
      showAlertMessage(`Creating a bike is failed (${err?.message || ''})`, {
        variant: 'error',
      });
    }).finally(() => {
      setLoading(false)
    })
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth>
      <DialogTitle>Add a new bike</DialogTitle>
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 4, pt: 0 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Model</InputLabel>
              <Select
                label="Model"
                name="model"
              >
                {
                  (constants.models || []).map((model) => (
                    <MenuItem value={model} key={model}>{model}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Color</InputLabel>
              <Select
                label="Color"
                name="color"
              >
                {
                  (constants.colors || []).map((color) => (
                    <MenuItem value={color} key={color}>{color}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Location</InputLabel>
              <Select
                label="Location"
                name="location"
              >
                {
                  (constants.locations || []).map((location) => (
                    <MenuItem value={location} key={location}>{location}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
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

export default AddNewBikeModal