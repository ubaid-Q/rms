import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { payOrder, fetchOrders } from './service';
import { BaseProps, Order, OrderStatus, Pagination } from '@/models';
import { Navbar } from '@/components/appbar';
import { AlertColor, Button, Chip, CircularProgress, Container, Menu, MenuItem, useTheme } from '@mui/material';
import { Cancel, FilterList, Payment, Print } from '@mui/icons-material';
import { AddOrderPayment } from '@/components/dialogs/addPayment';
import { cancelOrder } from '@/pages/orders/service';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import CustomCircularProgress from '@/components/circular';
import { useRouter } from 'next/router';

const orderStatus: Record<keyof typeof OrderStatus, AlertColor> = {
  PENDING: 'warning',
  CANCELED: 'error',
  COOKING: 'info',
  COMPLETED: 'success',
};

export default function Orders({ darkMode, toggleDarkMode }: BaseProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isLoading, setLoading] = React.useState(true);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [pagination, setPagination] = React.useState<Pagination>();
  const [date, setDate] = React.useState(dayjs().format('YYYY-MM-DD'));

  const handleMenuClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (option: any) => {
    // handleSort(option); // Call the sort handler function passed from parent component
    setAnchorEl(null);
  };

  const handleFilterClick = () => {
    // handleFilter(); // Call the filter handler function passed from parent component
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDateChange = (e) => {
    console.log(dayjs(e).format('YYYY-MM-DD'));
    setDate(dayjs(e).format('YYYY-MM-DD'));
  };

  React.useEffect(() => {
    console.log(dayjs().format('YYYY-MM-DD'));

    setOrders([]);
    fetchOrders({ date, setOrders, setPagination, page: 1, setLoading });
  }, [date]);

  React.useEffect(() => {
    if (pagination) {
      document.onscroll = handleScroll;
    }
  }, [pagination]);

  function handleScroll(e) {
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight,
    );
    const windowBottom = windowHeight + window.scrollY;
    if (windowBottom >= docHeight && pagination.nextPage) {
      setLoading(true);
      fetchOrders({ date, setOrders, setPagination, page: pagination.nextPage, setLoading });
    }
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
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} heading={'Orders'} route="/dashboard">
        <DatePicker formatDensity="dense" defaultValue={dayjs(date)} onChange={handleDateChange} />
        <IconButton color="inherit" onClick={handleMenuClick}>
          <FilterList />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem onClick={() => handleMenuItemClick('asc')}>Sort by Ascending</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('desc')}>Sort by Descending</MenuItem>
          <MenuItem onClick={handleFilterClick}>Filter</MenuItem>
        </Menu>
      </Navbar>
      <br />
      <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom>
        Total Items: {pagination?.total}
      </Typography>
      <TableContainer component={Paper} elevation={0}>
        <Table aria-label="collapsible table">
          <TableHead sx={{ backgroundColor: theme.palette.secondary.main }}>
            <TableRow>
              <TableCell />
              <TableCell>Order ID</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Net Amount</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Table No.</TableCell>
              <TableCell align="center">Payment Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((row, index) => (
              <Row key={row.id} row={row} darkMode={darkMode} setOrders={setOrders} orderIndex={index} />
            ))}
          </TableBody>
        </Table>
        {isLoading && <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>LOADING...</div>}
        <br />
        <br />
        <br />
        <br />
      </TableContainer>
    </Container>
  );
}

function Row(this: any, props: { row: Order; darkMode: boolean; setOrders: any; orderIndex: number }) {
  const theme = useTheme();
  const router = useRouter();
  const { row, darkMode } = props;
  const [open, setOpen] = React.useState(false);
  const [orderData, setOrderData] = React.useState<Order>(Object);
  const [paymentDialog, setPaymentDialog] = React.useState(false);

  React.useEffect(() => {
    setOrderData(row);
  }, [row]);

  const addPayment = async (data: any) => {
    const order = await payOrder(data);
    if (order) {
      setOrderData(order);
      setPaymentDialog(false);
    }
  };

  const handleCancelOrder = async () => {
    const order = await cancelOrder(orderData.id, 'localhost');
    setOrderData(order);
  };

  const printBill = (order) => {
    console.log({ order });
    localStorage.setItem('order_to_print', JSON.stringify(order));
    router.push('/dashboard/order/receipt');
  };

  return (
    <React.Fragment>
      <AddOrderPayment open={paymentDialog} setOpen={setPaymentDialog} onConfirm={addPayment} order={row} />
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          #000{orderData.id}
        </TableCell>
        <TableCell align="center">
          <Chip
            size="small"
            label={orderData.status}
            variant={darkMode ? 'outlined' : 'filled'}
            color={orderStatus[orderData.status]}
          />
        </TableCell>
        <TableCell align="center" style={{ fontWeight: 'bolder' }}>
          Rs. {orderData.totalAmount}/-
        </TableCell>
        <TableCell align="center">{new Date(orderData.createdAt).toLocaleString()}</TableCell>
        <TableCell align="center">{orderData.table?.tableNo ?? orderData.type}</TableCell>
        <TableCell align="center">
          {orderData.payment?.paymentMethod ? (
            <em style={{ color: 'green', fontWeight: 'bolder' }}>PAID (via {orderData.payment?.paymentMethod})</em>
          ) : (
            <strong>unpaid</strong>
          )}
        </TableCell>
        <TableCell align="center">
          {!orderData.payment ? (
            <Button
              onClick={setPaymentDialog.bind(this, true)}
              startIcon={<Payment />}
              color="warning"
              size="small"
              sx={{ textTransform: 'none' }}
            >
              Pay
            </Button>
          ) : (
            ''
          )}
          |
          <IconButton
            onClick={handleCancelOrder}
            disabled={orderData.status === OrderStatus.COMPLETED || orderData.status === OrderStatus.CANCELED}
          >
            <Cancel color="error" />
          </IconButton>
          |
          <IconButton onClick={printBill.bind(this, orderData)}>
            <Print />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                margin: 1,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ width: '90%' }}>
                <Typography variant="h6" gutterBottom component="div">
                  Detail
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell align="center">Price</TableCell>
                      <TableCell align="center">Total price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderData?.items?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell component="th" scope="row">
                          {item.menuItem.name}
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell align="center"> {item.menuItem.price}</TableCell>
                        <TableCell align="center">Rs. {item.price}/-</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
              <Box sx={{ pl: 4, width: '20%' }}>
                <Typography variant="h6" gutterBottom component="div">
                  Payment
                </Typography>
                <Typography>
                  <span style={{ color: theme.palette.text.secondary }}>Trx Id</span> :{' '}
                  {orderData.payment?.transactionId}
                </Typography>
                <Typography>
                  <span style={{ color: theme.palette.text.secondary }}>Payment method</span> :{' '}
                  {orderData.payment?.paymentMethod.toUpperCase()}
                </Typography>
                <Typography>
                  <span style={{ color: theme.palette.text.secondary }}>Paid Amount</span> :{' '}
                  {orderData.payment?.amount ?? 0} /-
                </Typography>
                <Typography>
                  <span style={{ color: theme.palette.text.secondary }}>Status</span> :{' '}
                  {orderData.payment?.paymentMethod ? (
                    <strong style={{ color: 'green' }}>PAID</strong>
                  ) : (
                    <strong style={{ color: 'red' }}>UNPAID</strong>
                  )}
                </Typography>
              </Box>
              <Box sx={{ pl: 4, width: '20%' }}>
                <Typography variant="h6" gutterBottom component="div">
                  Customer Info
                </Typography>
                <Typography>
                  <span style={{ color: theme.palette.text.secondary }}>Customer Name</span> :{orderData.customer?.name}
                </Typography>
                <Typography>
                  <span style={{ color: theme.palette.text.secondary }}>Phone</span> : {orderData.customer?.phone}
                </Typography>
                <Typography>
                  <span style={{ color: theme.palette.text.secondary }}>Address</span> : {orderData.customer?.address}
                </Typography>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
