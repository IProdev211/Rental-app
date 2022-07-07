import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { DialogTitle, Dialog, Button, Box, Grid, CircularProgress, TextField, Stack } from '@mui/material';

import { useAlertMessage } from '../../../hooks/useAlertMessage';
import { RootState } from '../../../redux/store';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { DateRangePicker, DateRange } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';
import { setMyReserves } from '../../../redux/reducers/reserveReducer';

interface ComponentProps {
  bike: string,
  open: boolean;
  onSubmitted: () => void;
  onClose: () => void;
}

const ReserveBikeModal: React.FC<ComponentProps> = (props) => {
  const dispatch = useDispatch()
  const { onClose, open, bike, onSubmitted } = props;
  const { showAlertMessage } = useAlertMessage();
  const [loading, setLoading] = useState<boolean>(false)
  const [value, setValue] = useState<DateRange<Date>>([null, null])
  const { userInfo } = useSelector((state: RootState) => state.auth)
  const { myReserves } = useSelector((state: RootState) => state.reserve)

  useEffect(() => {
    if (!open) {
      setValue([null, null])
    }
  }, [open])

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    if (!value[0] || !value[1]) {
      showAlertMessage('Please input the period', {
        variant: 'error',
      });
      return
    }

    setLoading(true)

    axios.post(`${process.env.REACT_APP_API_URL}/reserve`, {
      from: new Date(value[0] as unknown as Date).getTime(),
      to: new Date(value[1] as unknown as Date).getTime(),
      bike,
      user: userInfo.id,
      role: userInfo.role
    }).then(({ data }) => {
      if (data.success) {
        onSubmitted()
        dispatch(setMyReserves([...myReserves, data.newReserve]))
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
      <DialogTitle>Reserve a bike</DialogTitle>
      <Box sx={{ p: 4, pt: 0 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              localeText={{ start: 'From', end: 'To' }}
            >
              <DateRangePicker
                value={value}
                disablePast
                onChange={(newValue) => {
                  setValue(newValue);
                }}
                renderInput={(startProps, endProps) => (
                  <React.Fragment>
                    <Stack direction="row" width="100%" alignItems="center" justifyContent="space-between">
                      <TextField {...startProps} />
                      <Box sx={{ mx: 2 }}> to </Box>
                      <TextField {...endProps} />
                    </Stack>
                  </React.Fragment>
                )}
              />
            </LocalizationProvider>
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
                fullWidth
                variant="contained"
                onClick={handleSubmit}
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

export default ReserveBikeModal