import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Theme,
} from "@mui/material";
import { ChangeEvent } from "react";
import { makeStyles } from "@mui/styles";
import Image from "next/image";
import { Edit, Update } from "@mui/icons-material";
import { config } from "@/config/config";

const useStyles = makeStyles((theme: Theme) => ({
  formControl: {
    marginBottom: theme.spacing(2),
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    overflow: "hidden",
    borderRadius: 20,
  },
  imagePreview: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: 20,
  },
  uploadButton: {
    cursor: "pointer",
    padding: "10px 14px",
    position: "absolute",
    color: "whitesmoke",
    transition: "background-color 0.3s ease",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  fileInput: {
    display: "none",
  },
}));

interface Category {
  id: number;
  name: string;
}

interface EditItemProps {
  open: boolean;
  onSubmit: (e: any) => Promise<void>;
  onClose: () => void;
  onChange: (e: any) => void;
  data: {
    name: string;
    description: string;
    price: string;
    image: string;
    categoriesId: number;
  };
  categories: Category[];
}

export function EditMenuItem({
  open,
  onSubmit,
  onClose,
  onChange,
  data,
  categories,
}: EditItemProps) {
  const classes = useStyles();
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    console.log(data.image);
    setImagePreview(config.apiHost + "/" + data.image);
  }, [data.image]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Item</DialogTitle>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <div className={classes.imageContainer}>
            <label htmlFor="image" className={classes.uploadButton}>
              <Edit />
            </label>
            <input
              accept="image/*"
              id="image"
              type="file"
              name="image"
              onChange={handleImageChange}
              className={classes.fileInput}
            />

            <img
              src={imagePreview}
              alt="Preview"
              className={classes.imagePreview}
              width={100}
              height={100}
            />
          </div>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            name="name"
            onChange={onChange}
            value={data.name}
          />
          <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            name="description"
            multiline
            rows={3}
            onChange={onChange}
            value={data.description}
          />
          <Box
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 10,
              justifyContent: "space-between",
            }}
          >
            <TextField
              margin="dense"
              id="price"
              label="Price"
              type="text"
              fullWidth
              name="price"
              onChange={onChange}
              value={data.price}
            />
            <FormControl fullWidth className={classes.formControl}>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                label="Category"
                name="categoriesId"
                onChange={onChange}
                value={data.categoriesId}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <DialogActions>
            <Button onClick={onClose} color="inherit">
              Cancel
            </Button>
            <Button
              type="submit"
              color="success"
              variant="contained"
              disableElevation
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
