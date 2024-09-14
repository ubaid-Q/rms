import React, { FormEventHandler, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';

interface Props {
  open: boolean;
  onClose?: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export const AddExpense = ({ open, onClose, onSubmit }: Props) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
    categoriesId: '',
  });

  const resetForm = () => {
    setFormData({ ...formData, image: null });
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ style: { borderRadius: 20 } }}>
      <DialogTitle>Add Expense</DialogTitle>
      <DialogContent>
        <form onSubmit={onSubmit} onReset={resetForm}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Description" name="description" multiline rows={3} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Amount" type="text" name="amount" inputMode="numeric" />
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

export default AddExpense;
