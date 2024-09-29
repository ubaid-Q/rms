import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  IconButton,
  Card,
  CardContent,
  Box,
  Button,
  useTheme,
  Divider,
  ButtonGroup,
} from '@mui/material';
import { AssessmentOutlined, Cancel, InfoOutlined, PaymentRounded, Person2, Print } from '@mui/icons-material';
import TableSVG from './assets/table_dashboard.svg';
import OrderSVG from './assets/order_dashboard.svg';
import MenuSVG from './assets/menu_dashboard.svg';
import InventorySVG from './assets/inventory_dashboard.svg';
import StaffSVG from './assets/staff_dashboard.svg';
import ExpanseSVG from './assets/expanse_dasboard.svg';
import Link from 'next/link';
import { BaseProps, Order } from '@/models';
import { getPendingOrders } from './service';
import { Navbar } from '@/components/appbar';
import ReportDialog from '@/components/dialogs/report';
import axios from 'axios';
import IpDialog from '@/components/dialogs/ipDialog';
import socket from '../socket-client';
import { cancelOrder } from '../orders/service';
import { AddOrderPayment } from '@/components/dialogs/addPayment';
import { payOrder } from './order/service';
import { useRouter } from 'next/router';

const Dashboard = ({ toggleDarkMode, darkMode }: BaseProps) => {
  const theme = useTheme();
  const router = useRouter();

  const [ongoingOrders, setOngoingOrders] = useState<Order[]>([]);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [reportDialog, setReportDialog] = useState(false);
  const [order, setOrder] = useState<Order>(Object);
  const [ipDialog, setIpDialog] = useState(false);
  const [ip, setIp] = useState();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    getOngoingOrders();
    socket.on('newOrder', (data) => {
      getOngoingOrders();
    });
    const adminData = localStorage.getItem('adminData');
    if (adminData) setAdmin(JSON.parse(adminData).data.user);
  }, []);

  function generateReport() {
    setReportDialog(true);
  }

  async function getOngoingOrders() {
    const orders = await getPendingOrders();
    setOngoingOrders(orders);
  }

  async function showIp() {
    const res = await axios.get('http://localhost:5000/api/api');
    setIp(res.data.data);
    setIpDialog(true);
  }
  async function handleCancelOrder() {
    console.log(this);
    const order = await cancelOrder(this.id, 'localhost');
    getOngoingOrders();
  }

  const addPayment = async (data: any) => {
    const order = await payOrder(data);
    if (order) {
      setOrder(order);
      setPaymentDialog(false);
      getOngoingOrders();
    }
  };

  function handlePayment() {
    setOrder(this);
    setPaymentDialog(true);
  }

  function logout() {
    localStorage.clear();
    router.reload();
  }

  const printBill = (order) => {
    console.log({ order });
    localStorage.setItem('order_to_print', JSON.stringify(order));
    router.push('/dashboard/order/receipt');
  };

  return (
    <Container
      style={{
        maxWidth: '100%',
        height: '100%',
        minHeight: '100vh',
        padding: theme.spacing(3),
        backgroundColor: theme.palette.background.default,
      }}
    >
      <AddOrderPayment open={paymentDialog} setOpen={setPaymentDialog} onConfirm={addPayment} order={order} />
      <IpDialog ip={ip} onClose={() => setIpDialog(false)} open={ipDialog} />
      <ReportDialog open={reportDialog} onClose={() => setReportDialog(false)} />
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        heading={
          <Typography variant="h5" color={theme.palette.text.primary}>
            Restaurant.
          </Typography>
        }
        route=""
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'green' }}>
          <Person2 />
          <p>{admin ? admin.username : 'Guest'}</p>
        </div>
        {admin ? (
          <Button variant="text" onClick={logout}>
            Logout
          </Button>
        ) : (
          ''
        )}

        <Link href="/dashboard/order/create-order?dashboard=true">
          <Button variant="outlined" sx={{ textTransform: 'none' }}>
            Create Order
          </Button>
        </Link>
        <Link href="/dashboard/report">
          <Button variant="outlined" sx={{ textTransform: 'none' }}>
            Get Insights
          </Button>
        </Link>

        <Button onClick={showIp}>ShowIP</Button>
      </Navbar>
      <br />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button startIcon={<AssessmentOutlined />} onClick={generateReport}>
          Generate Report
        </Button>
        <Typography variant="h4" color={theme.palette.text.primary}>
          Dashboard
        </Typography>
      </Box>
      <br />
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            style={{
              padding: 5,
              borderRadius: 20,
              minHeight: '95%',
              maxHeight: '75vh',
              marginBottom: 10,
              backgroundColor: theme.palette.background.paper,
              overflow: 'auto',
            }}
            variant="outlined"
          >
            <Typography style={{ marginLeft: 15 }} variant="h6" gutterBottom>
              Ongoing Orders ({ongoingOrders.length})
            </Typography>
            <Box style={{ marginTop: 20 }}>
              {ongoingOrders.map((order) => (
                <Card
                  elevation={6}
                  key={order.id}
                  variant="outlined"
                  className="link"
                  sx={{ margin: 2, borderRadius: 5 }}
                >
                  <CardContent style={{ padding: 16 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <Box sx={{ marginRight: 2 }}>
                        <Typography variant="h6" color="primary">
                          Order #000{order.id}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                          {order.type === 'PARCEL' ? 'Parcel Order' : `Table: #${order.table?.tableNo}`}
                        </Typography>
                        <Typography variant="body1" color="textSecondary" gutterBottom>
                          Customer Name: {order.customer?.name || '--'}
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                          Phone: {order.customer?.phone || '--'}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography variant="body1" color="textSecondary">
                          Status: <strong>{order.status}</strong>
                        </Typography>
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          Total: {order.totalAmount}/-
                        </Typography>
                        <br />
                        <ButtonGroup size="small" aria-label="Small button group">
                          <Button endIcon={<Print />} onClick={printBill.bind(this, order)}>
                            Print
                          </Button>
                          <Button onClick={handleCancelOrder.bind(order)} endIcon={<Cancel />}>
                            Cancel
                          </Button>
                          <Button onClick={handlePayment.bind(order)} endIcon={<PaymentRounded />}>
                            Pay
                          </Button>
                        </ButtonGroup>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={7}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Link href={'/dashboard/tables'} style={{ textDecoration: 'none' }}>
                <Paper
                  elevation={3}
                  style={{
                    padding: 20,
                    borderRadius: 20,
                    minHeight: '200px',
                    position: 'relative',
                    textAlign: 'center',
                    overflow: 'hidden',
                  }}
                  className="link"
                  variant="outlined"
                >
                  <TableSVG
                    style={{
                      width: '100%',
                      height: '150px',
                      margin: '0 auto',
                    }}
                  />
                  <Typography variant="h6" gutterBottom>
                    Table Management
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                    Easily manage your restaurant tables.
                  </Typography>
                  <IconButton color="primary" aria-label="info">
                    <InfoOutlined />
                  </IconButton>
                </Paper>
              </Link>
            </Grid>
            <Grid item xs={12} md={4}>
              <Link href={'/dashboard/menu'} style={{ textDecoration: 'none' }}>
                <Paper
                  variant="outlined"
                  elevation={3}
                  style={{
                    padding: 20,
                    borderRadius: 20,
                    minHeight: '200px',
                    position: 'relative',
                    textAlign: 'center',
                    overflow: 'hidden',
                  }}
                  className="link"
                >
                  <MenuSVG
                    style={{
                      width: '100%',
                      height: '150px',
                      margin: '0 auto',
                    }}
                  />

                  <Typography variant="h6" gutterBottom>
                    Menu Management
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                    Manage your restaurant menu items.
                  </Typography>
                  <IconButton color="primary" aria-label="info">
                    <InfoOutlined />
                  </IconButton>
                </Paper>
              </Link>
            </Grid>
            <Grid item xs={12} md={4}>
              <Link href={'/dashboard/order'} style={{ textDecoration: 'none' }}>
                <Paper
                  variant="outlined"
                  elevation={3}
                  style={{
                    padding: 20,
                    borderRadius: 20,
                    minHeight: '200px',
                    position: 'relative',
                    textAlign: 'center',
                    overflow: 'hidden',
                  }}
                  className="link"
                >
                  <OrderSVG
                    style={{
                      margin: '0 auto',
                    }}
                  />

                  <Typography variant="h6" gutterBottom>
                    Order Management
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                    View and manage restaurant orders.
                  </Typography>
                  <IconButton color="primary" aria-label="info">
                    <InfoOutlined />
                  </IconButton>
                </Paper>
              </Link>
            </Grid>
          </Grid>
          <Divider sx={{ margin: 4 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Link href={'#'} style={{ textDecoration: 'none' }}>
                <Paper
                  elevation={3}
                  style={{
                    padding: 20,
                    borderRadius: 20,
                    minHeight: '200px',
                    position: 'relative',
                    textAlign: 'center',
                    overflow: 'hidden',
                  }}
                  className="link"
                  variant="outlined"
                >
                  <InventorySVG
                    style={{
                      width: '100%',
                      height: '150px',
                      margin: '0 auto',
                    }}
                  />
                  <Typography variant="h6" gutterBottom>
                    Inventory Management
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                    Easily manage your restaurant inventory.
                  </Typography>
                  <IconButton color="primary" aria-label="info">
                    <InfoOutlined />
                  </IconButton>
                </Paper>
              </Link>
            </Grid>
            <Grid item xs={12} md={4}>
              <Link href={'/dashboard/staff'} style={{ textDecoration: 'none' }}>
                <Paper
                  variant="outlined"
                  elevation={3}
                  style={{
                    padding: 20,
                    borderRadius: 20,
                    minHeight: '200px',
                    position: 'relative',
                    textAlign: 'center',
                    overflow: 'hidden',
                  }}
                  className="link"
                >
                  <StaffSVG
                    style={{
                      width: '100%',
                      height: '150px',
                      margin: '0 auto',
                    }}
                  />

                  <Typography variant="h6" gutterBottom>
                    Staff Management
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                    Manage your restaurant Staff.
                  </Typography>
                  <IconButton color="primary" aria-label="info">
                    <InfoOutlined />
                  </IconButton>
                </Paper>
              </Link>
            </Grid>
            <Grid item xs={12} md={4}>
              <Link href={'/dashboard/expense'} style={{ textDecoration: 'none' }}>
                <Paper
                  variant="outlined"
                  elevation={3}
                  style={{
                    padding: 20,
                    borderRadius: 20,
                    minHeight: '200px',
                    position: 'relative',
                    textAlign: 'center',
                    overflow: 'hidden',
                  }}
                  className="link"
                >
                  <ExpanseSVG
                    style={{
                      margin: '0 auto',
                    }}
                  />

                  <Typography variant="h6" gutterBottom>
                    Expense Management
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                    View and manage restaurant orders.
                  </Typography>
                  <IconButton color="primary" aria-label="info">
                    <InfoOutlined />
                  </IconButton>
                </Paper>
              </Link>
            </Grid>
          </Grid>
        </Grid>{' '}
      </Grid>
    </Container>
  );
};

export default Dashboard;
