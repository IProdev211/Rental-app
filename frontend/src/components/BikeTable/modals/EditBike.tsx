import React, { useState } from 'react';
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { DialogTitle, Dialog, Button, Box, Grid, CircularProgress, MenuItem, FormControl, Select, InputLabel } from '@mui/material';

import { useAlertMessage } from '../../../hooks/useAlertMessage';
import { RootState } from '../../../redux/store';
import { updateBike } from '../../../redux/reducers/bikeReducer';
import { TBike } from '../../../types';

interface ComponentProps {
  bike: TBike
  open: boolean;
  onClose: () => void;
}

const EditBikeModal: React.FC<ComponentProps> = (props) => {
  const dispatch = useDispatch()
  const { onClose, open, bike } = props;
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

    axios.put(`${process.env.REACT_APP_API_URL}/bike/edit`, {
      bike: {
        ...bike,
        model: formData.get('model'),
        location: formData.get('location'),
        color: formData.get('color'),
      }
    }).then(({ data }) => {
      if (data.success) {
        dispatch(updateBike({
          ...bike,
          model: formData.get('model'),
          location: formData.get('location'),
          color: formData.get('color'),
        }))
        showAlertMessage('The bike is updataed succssfully!', { variant: 'success' });
        onClose()
      } else {
        showAlertMessage(`Updating a bike is failed!`, {
          variant: 'error',
        });
      }
    }).catch((err) => {
      showAlertMessage(`Updating a bike is failed (${err?.message || ''})`, {
        variant: 'error',
      });
    }).finally(() => {
      setLoading(false)
    })
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth>
      <DialogTitle>Edit a bike</DialogTitle>
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 4, pt: 0 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Model</InputLabel>
              <Select
                label="Model"
                name="model"
                defaultValue={bike?.model}
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
                defaultValue={bike?.color}
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
                defaultValue={bike?.location}
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
                {loading ? (<CircularProgress size={24} color="warning" />) : <span>Submit</span>}
              </Button>
            </Grid>
          </Grid>
        </Grid>

      </Box>
    </Dialog >
  );
}

export default EditBikeModal