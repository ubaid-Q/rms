import React, { ReactEventHandler, useEffect, useRef, useState } from 'react';
import {
  Button,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  Container,
  Box,
  CircularProgress,
  Chip,
  MenuItem,
  Select,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import { Navbar } from '@/components/appbar';
import { addTable, changeTableStatus, getTables } from './service';
import { BaseProps, tableStatus } from '@/models';
import { Done } from '@mui/icons-material';

export default function Tables({ toggleDarkMode, darkMode }: BaseProps) {
  const theme = useTheme();
  const [tables, setTables] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTable, setNewTable] = useState({ capacity: 0, tableNo: 0 });
  const [statusChanges, setStatusChanges] = useState<{ [tableId: number]: keyof typeof tableStatus }>({});

  useEffect(() => {
    getTables({ setLoading, setTables });
  }, []);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setNewTable({ capacity: 0, tableNo: 0 });
  };

  const handleAddTable = () => {
    if (newTable.tableNo && newTable.capacity) {
      addTable({ setTables, tableData: newTable });
      setIsDialogOpen(false);
      setNewTable({ capacity: 0, tableNo: 0 });
    } else {
      alert('Please enter both table number and capacity');
    }
  };

  const handleChangeStatus = (event: React.ChangeEvent<{ value: unknown }>, index: number) => {
    const status = event.target.value as any;
    console.log(status);
    console.log({ index });

    setStatusChanges({ [index]: status });
  };

  const handleCancelChanges = (index: number) => {
    const updatedStatusChanges = { ...statusChanges };
    delete updatedStatusChanges[index];
    setStatusChanges(updatedStatusChanges);
  };

  useEffect(() => {
    console.log({ statusChanges });
  }, [statusChanges]);

  async function handleSaveChanges(this: any, index: number) {
    const data = await changeTableStatus(this.tableNo, statusChanges[this.id]);
    tables.splice(index, 1, data);
    setTables([...tables]);
    setStatusChanges({ [this.id]: data.status });
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
      {isLoading && (
        <Box display="flex" alignItems="center" justifyContent="center" height="50vh">
          <CircularProgress color="secondary" />
        </Box>
      )}
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} heading={'Tables'} route="/dashboard">
        <Button variant="contained" startIcon={<AddIcon />} onClick={openDialog}>
          Add Table
        </Button>
      </Navbar>
      <br />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Action (Cancel/Save)</TableCell>
            <TableCell align="center">Change Status</TableCell>
            <TableCell align="center">Table Number</TableCell>
            <TableCell align="center">Capacity</TableCell>
            <TableCell align="center">Current Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody style={{ backgroundColor: theme.palette.background.paper }}>
          {tables.map((table: any, index) => (
            <TableRow key={index}>
              <TableCell>
                <Button
                  variant="text"
                  color="error"
                  disabled={statusChanges[table.id] ? statusChanges[table.id] == table.status : true}
                  onClick={() => handleCancelChanges(table.id)}
                >
                  <CancelIcon />
                </Button>
                <Button
                  variant="text"
                  disabled={statusChanges[table.id] ? statusChanges[table.id] == table.status : true}
                  onClick={handleSaveChanges.bind(table, index)}
                >
                  <Done />
                </Button>
              </TableCell>
              <TableCell align="center">
                <Select
                  value={statusChanges[table.id] || table.status}
                  onChange={(e: any) => handleChangeStatus(e, table.id)}
                  style={{ minWidth: '80%' }}
                  size="small"
                >
                  <MenuItem value="" disabled>
                    Select Status
                  </MenuItem>
                  <MenuItem value={'AVAILABLE'}>Available</MenuItem>
                  <MenuItem value={'OCCUPIED'}>Occupied</MenuItem>
                  <MenuItem value={'RESERVED'}>Reserved</MenuItem>
                </Select>
              </TableCell>
              <TableCell align="center">
                <TextField
                  fullWidth
                  defaultValue={table.tableNo}
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  inputProps={{ style: { textAlign: 'center' } }}
                />
              </TableCell>
              <TableCell align="center">
                <TextField
                  fullWidth
                  defaultValue={table.capacity}
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  inputProps={{ style: { textAlign: 'center' } }}
                />
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={table.status}
                  variant={darkMode ? 'outlined' : 'filled'}
                  color={tableStatus[table.status as keyof typeof tableStatus] as any}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogTitle>Add Table</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Table Number"
            type="text"
            inputMode="numeric"
            fullWidth
            value={newTable.tableNo}
            onChange={(e) => setNewTable({ ...newTable, tableNo: +e.target.value })}
          />
          <TextField
            margin="dense"
            label="Capacity"
            type="text"
            inputMode="numeric"
            fullWidth
            value={newTable.capacity}
            onChange={(e) => setNewTable({ ...newTable, capacity: +e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={handleAddTable} variant="contained" color="primary" autoFocus>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
