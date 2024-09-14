import React, { FormEventHandler, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

interface Category {
  id: number;
  name: string;
}

interface Props {
  open: boolean;
  onClose?: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

const useStyles = makeStyles((theme: Theme) => ({
  uploadContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  uploadButton: {
    marginRight: theme.spacing(2),
  },
  imagePreview: {
    maxWidth: '100%',
    maxHeight: 200,
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(2),
  },
}));

export const AddStaff = ({ open, onClose, onSubmit }: Props) => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    role: '',
    salary: 0,
  });

  const resetForm = () => {
    setFormData({ ...formData });
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ style: { borderRadius: 20 } }}>
      <DialogTitle>Add Member</DialogTitle>
      <DialogContent>
        <form onSubmit={onSubmit} onReset={resetForm}>
          <Grid container spacing={2} padding={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Name" name="name" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Phone Number" name="phoneNumber" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Role" type="text" name="role" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Salary" type="number" inputMode="numeric" name="salary" />
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Add
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStaff;
