import React, { FormEventHandler, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Theme,
  Typography,
} from '@mui/material';
import UploadIcon from '@mui/icons-material/CloudUpload';
import { makeStyles } from '@mui/styles';
import Image from 'next/image';

interface Category {
  id: number;
  name: string;
}

interface AddMenuProps {
  open: boolean;
  onClose?: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  categories: Category[];
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

export const AddMenuItem = ({ open, onClose, onSubmit, categories }: AddMenuProps) => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
    categoriesId: '',
  });

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    setFormData((prevFormData) => ({
      ...prevFormData,
      image: file,
    }));
  };

  const resetForm = () => {
    setFormData({ ...formData, image: null });
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ style: { borderRadius: 20 } }}>
      <DialogTitle>Add New Item</DialogTitle>
      <DialogContent>
        <form onSubmit={onSubmit} onReset={resetForm}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Name" name="name" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Description" name="description" multiline rows={3} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Price ($)" type="number" name="price" />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select name="categoriesId">
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {categories.map((category: any) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <div className={classes.uploadContainer}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  name="image"
                  id="image"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="image">
                  <Button variant="contained" component="span" className={classes.uploadButton} startIcon={<UploadIcon />}>
                    Upload Image
                  </Button>
                </label>
                {formData.image && <Typography variant="body2">{formData.image['name']}</Typography>}
              </div>
              {formData.image && (
                <Image
                  src={URL.createObjectURL(formData.image)}
                  alt="Preview"
                  className={classes.imagePreview}
                  width={100}
                  height={100}
                />
              )}
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

export default AddMenuItem;
