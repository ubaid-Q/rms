import React, { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import {
  Container,
  Grid,
  TextField,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Navbar } from '@/components/appbar';
import { addCategory, addNewMenuItem, deleteMenuItem, getCategories, getMenuItems, updateEditItem } from './service';
import { FoodCard } from '@/components/menuItem/itemCard';
import { MenuItemType } from '@/models';
import { AddMenuItem } from '@/components/dialogs/addItem';
import { EditMenuItem } from '@/components/dialogs/editItem';
import { Confirmation } from '@/components/ConfirmationDialog';

type OpenDialog = {
  category: boolean;
  newItem: boolean;
  editItem: boolean;
};

const MenuPage = ({ toggleDarkMode, darkMode }: { toggleDarkMode: () => void; darkMode: boolean }) => {
  const theme = useTheme();
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [updateItem, setUpdateItem] = useState(Object);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [deleteCofirmDialog, setDeleteConfirmDialog] = useState(false);
  const [menuItem, setMenuItem] = useState<any>({});
  const [openDialog, setOpenDialog] = useState<OpenDialog>({ category: false, newItem: false, editItem: false });

  useEffect(() => {
    getCategories({ setCategories });
    getMenuItems({ setMenuItems });
  }, []);

  const filteredMenuItems = menuItems.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === 'All' || item.category?.name === categoryFilter)
    );
  });

  const editItem = (e: ChangeEvent<HTMLInputElement> | any) => {
    setUpdateItem({ ...updateItem, [e.target.name]: e.target.value });
  };

  const handleEditItem = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedItem = await updateEditItem(updateItem.id, formData);
    const itemIndex = menuItems.findIndex((item) => item.id === updatedItem.id);
    menuItems[itemIndex] = updatedItem;
    setOpenDialog({ ...openDialog, editItem: false });
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event: any) => {
    setCategoryFilter(event.target?.value as string);
  };

  const handleCloseAddDialog = (targetName: keyof typeof openDialog) => {
    setOpenDialog({ ...openDialog, [targetName]: false });
  };

  const handleOpenEditDialog = (dish: MenuItemType) => {
    setUpdateItem(dish);
    setOpenDialog({ ...openDialog, editItem: true });
  };

  const handleAddCategory = (e: any) => {
    e.preventDefault()
    const formdata = new FormData(e.target);
    addCategory({ categoryName: formdata.get('categoryName'), setCategories });
    setOpenDialog({ ...openDialog, category: false });
  };

  async function handleAddDish(event: SyntheticEvent) {
    event.preventDefault();
    addNewMenuItem({ setMenuItems }, event);
    setOpenDialog({ ...openDialog, newItem: false });
  }

  function handleDelete(data) {
    setMenuItem(data);
    setDeleteConfirmDialog(true);
  }

  async function deleteItem() {
    await deleteMenuItem(menuItem.id);
    setDeleteConfirmDialog(false);
    setMenuItem({});
    getMenuItems({ setMenuItems });
  }

  return (
    <Container
      style={{
        maxWidth: '100%',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
      }}
    >
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} heading={'Menu'} route="/dashboard">
        <TextField
          variant="outlined"
          label="Search Menu"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            value={categoryFilter}
            onChange={handleCategoryChange}
            label="Category"
          >
            <MenuItem value="All">All</MenuItem>
            {categories.map((category: any) => (
              <MenuItem key={category.name} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog({ ...openDialog, newItem: true })}
          disableElevation
        >
          Add New
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog({ ...openDialog, category: true })}
          disableElevation
        >
          Add New Category
        </Button>
      </Navbar>
      <br />
      <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom>
        Total Items: {menuItems.length}
      </Typography>
      <Grid container spacing={2} marginTop={5}>
        {filteredMenuItems.map((item) => (
          <Grid item xs={12} sm={2} md={3} key={item.id}>
            <FoodCard data={item} onEdit={handleOpenEditDialog} onDelete={handleDelete} />
          </Grid>
        ))}
      </Grid>
      <AddMenuItem
        open={openDialog.newItem}
        onClose={handleCloseAddDialog.bind(this, 'newItem')}
        onSubmit={handleAddDish}
        categories={categories}
      />

      <EditMenuItem
        categories={categories}
        data={updateItem}
        onChange={editItem}
        onClose={handleCloseAddDialog.bind(this, 'editItem')}
        onSubmit={handleEditItem}
        open={openDialog.editItem}
      />

      <Confirmation
        message="Want to delete the item? are you sure?"
        onCancel={setDeleteConfirmDialog}
        open={deleteCofirmDialog}
        setOpen={setDeleteConfirmDialog}
        onConfirm={deleteItem}
      />

      <Dialog open={openDialog.category} onClose={handleCloseAddDialog.bind(this, 'category')}>
        <DialogTitle>Add New Category</DialogTitle>
        <form onSubmit={handleAddCategory}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="categoryName"
              label="Name"
              type="text"
              fullWidth
              name="categoryName"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddDialog.bind(this, 'category')} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default MenuPage;
