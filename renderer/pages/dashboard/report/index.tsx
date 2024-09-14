import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import { Doughnut, Bar } from 'react-chartjs-2';
import { ArcElement, BarElement, CategoryScale, ChartData, Chart as ChartJS, LinearScale } from 'chart.js/auto';
import { getReport } from './service';
import { OrderStatus } from '@/models';
import { Navbar } from '@/components/appbar';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement);

const Dashboard = ({ darkMode, toggleDarkMode }) => {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState(dayjs().toString());
  const [admin, setAdmin] = useState(null);
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    getReport({ date, setReportData });
    const adminData = localStorage.getItem('adminData');
    if (adminData) {
      setAdmin(JSON.parse(adminData).data.user);
    }
  }, [date]);

  if (!reportData) return;

  if (!admin) {
    router.push('/dashboard/login');
    return <CircularProgress />;
  }

  const handleDateChange = (e) => {
    const date = new Date(e.$y, e.$M, e.$D);
    setDate(date.toLocaleString());
  };
  const cancelledOrders = reportData?.orders?.filter((order) => order.status === OrderStatus.CANCELED) || [];
  const completedOrders = reportData?.orders?.filter((order) => order.status === OrderStatus.COMPLETED) || [];

  const data = {
    totalOrders: reportData.orders.length,
    totalRevenue: completedOrders.reduce((prev, curr) => prev + curr.totalAmount, 0),
    totalExpenses: reportData.expenses.reduce((prev, curr) => prev + curr.amount, 0),
    topSellingItems: reportData.items.map((item) => ({ name: item.name, quantitySold: item.totalquantity })),
    orderStatusDistribution: {
      Completed: completedOrders.length,
      Canceled: cancelledOrders.length,
    },
  };

  const { totalOrders, totalExpenses, totalRevenue, topSellingItems, orderStatusDistribution } = data;

  const doughnutData = {
    labels: Object.keys(orderStatusDistribution),
    datasets: [
      {
        data: Object.values(orderStatusDistribution),
        backgroundColor: ['#4CAF50', '#db2f2f'],
        hoverBackgroundColor: ['#4CAF50', '#db2f2f'],
      },
    ],
  };

  const barData: ChartData<'bar'> = {
    labels: topSellingItems.map((item) => item.name),
    datasets: [
      {
        label: 'Quantity Sold',
        backgroundColor: '#2196F3',
        borderColor: '#2196F3',
        borderWidth: 1,
        hoverBackgroundColor: '#64B5F6',
        hoverBorderColor: '#64B5F6',
        data: topSellingItems.map((item) => item.quantitySold),
      },
    ],
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
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} heading={'Insights Dashboard'} route="/dashboard">
        <DatePicker formatDensity="dense" defaultValue={dayjs(date)} onChange={handleDateChange} />
      </Navbar>
      <br />
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ borderRadius: 4 }}>
            <Box p={2}>
              <Typography variant="h6" gutterBottom>
                Total Orders
              </Typography>
              <Typography variant="h4" gutterBottom>
                {totalOrders}
              </Typography>
              <small>Orders of the day</small>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ borderRadius: 4 }}>
            <Box p={2}>
              <Typography variant="h6" gutterBottom>
                Total Sale
              </Typography>
              <Typography variant="h4" gutterBottom>
                Rs. {totalRevenue}
              </Typography>
              <small>Sale of the day</small>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ borderRadius: 4 }}>
            <Box p={2}>
              <Typography variant="h6" gutterBottom>
                Total Expenses
              </Typography>
              <Typography variant="h4" gutterBottom>
                Rs. {totalExpenses}
              </Typography>
              <small>Expenses of the day</small>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ borderRadius: 4 }}>
            <Box p={2}>
              <Typography variant="h6" gutterBottom>
                Net Amount
              </Typography>
              <Typography variant="h4" gutterBottom color={totalRevenue - totalExpenses >= 0 ? 'green' : 'red'}>
                Rs. {totalRevenue - totalExpenses}/-
              </Typography>
              <small>Net amount of the day</small>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={9}>
          <Paper elevation={3} sx={{ borderRadius: 4 }}>
            <Box p={2}>
              <Typography variant="h6" gutterBottom>
                Top Selling Items
              </Typography>
              <Bar data={barData} height={92} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ borderRadius: 4 }}>
            <Box p={2}>
              <Typography variant="h6" gutterBottom>
                Order Status Distribution
              </Typography>
              <Doughnut data={doughnutData} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
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
                {reportData?.expenses?.map((row: any) => (
                  <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row" sx={{ wordBreak: 'break-all', maxWidth: 200 }}>
                      {row.description}
                    </TableCell>
                    <TableCell>{row.amount}</TableCell>
                    <TableCell>
                      {new Date(row.createdAt).toDateString() + ' ' + new Date(row.createdAt).toLocaleTimeString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
