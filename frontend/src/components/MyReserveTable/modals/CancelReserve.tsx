import React, { useEffect, useState } from 'react';
import { DialogTitle, Dialog, Button, Box, Grid, CircularProgress, Rating } from '@mui/material';

interface ComponentProps {
  open: boolean;
  loading: boolean;
  onSubmit: (arg: number) => void;
  onClose: () => void;
}

const CancelReserveModal: React.FC<ComponentProps> = (props) => {
  const { onClose, open, loading, onSubmit } = props;
  const [rating, setRating] = useState<number>(0)

  useEffect(() => {
    if (!open) {
      setRating(0)
    }
  }, [open])

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth>
      <DialogTitle>Cancel a reserve</DialogTitle>
      <Box sx={{ p: 4, pt: 0 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Rating
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue || 0);
              }}
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
                fullWidth
                variant="contained"
                onClick={() => onSubmit(rating)}
                disabled={loading}
              >
                {loading ? (<CircularProgress size={24} color="warning" />) : <span>Submit</span>}
              </Button>
            </Grid>
          </Grid>
        </Grid>

      </Box>
    </Dialog>
  );
}

export default CancelReserveModal