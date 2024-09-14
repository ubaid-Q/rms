import { Navbar } from '@/components/appbar';
import AddExpense from '@/components/dialogs/addExpense';
import { BaseProps } from '@/models';
import Add from '@mui/icons-material/Add';
import Paper from '@mui/material/Paper';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { addExpense, deleteExpense, getExpenses } from './service';
import { Delete, Search } from '@mui/icons-material';
import { CalendarIcon, DateCalendar, DatePicker, MonthCalendar } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const Expense = ({ darkMode, toggleDarkMode }: BaseProps) => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expenses, setExpenses] = useState<any[]>([]);
  const [date, setDate] = useState(new Date().toJSON());

  useEffect(() => {
    getExpenses({ setExpenses, date });
  }, [date]);

  function submit(e: any) {
    e.preventDefault();
    const data = new FormData(e.target);
    setOpenDialog(false);
    addExpense(
      {
        description: data.get('description'),
        amount: Number(data.get('amount')),
      },
      { setExpenses },
    );
  }

  const deleteExp = (id: number) => {
    deleteExpense(id).then((deleted: any) => {
      const index = expenses?.findIndex((value) => value.id === deleted.id);
      expenses?.splice(index, 1);
      setExpenses([...expenses]);
    });
  };

  const dateHandler = (e) => {
    const selectedDate = dayjs(new Date(e.$y, e.$M, e.$D)).format('YYYY-MM-DD');
    setDate(selectedDate);
  };

  return (
    <Container
      style={{
        maxWidth: '100%',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
      }}
    >
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} heading={'Expenses'} route="/dashboard">
        <TextField
          variant="outlined"
          label="Search "
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
          disableElevation
        >
          Add
        </Button>
      </Navbar>
      <br />
      <br />
      <Card elevation={0} variant="outlined" style={{ marginBottom: 10, borderRadius: 20 }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body1" color={theme.palette.text.secondary} paddingLeft={2}>
            Total Expense <br />
            <span
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: theme.palette.success.main,
              }}
            >
              Rs. {expenses?.reduce((prev, curr) => prev + curr.amount, 0)}
            </span>
            <br />
            {/* <span style={{ fontSize: '18px', color: theme.palette.text.primary }}>
              Month {date?.month ?? new Date(expenses?.[0]?.createdAt ?? Date.now()).getMonth()}-{date?.year ?? new Date(expenses?.[0]?.createdAt ?? Date.now()).getFullYear()}
            </span> */}
          </Typography>
          <Box>
            <DatePicker label="Select Date" disableFuture={true} onChange={dateHandler} />
          </Box>
        </CardContent>
      </Card>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses?.map((row: any) => (
              <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row" sx={{ wordBreak: 'break-all', maxWidth: 200 }}>
                  {row.description}
                </TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>
                  {new Date(row.createdAt).toDateString() + ' ' + new Date(row.createdAt).toLocaleTimeString()}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => deleteExp(row.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AddExpense onSubmit={submit} open={openDialog} onClose={() => setOpenDialog(false)} />
    </Container>
  );
};

export default Expense;
