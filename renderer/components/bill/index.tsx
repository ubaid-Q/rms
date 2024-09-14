import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Box,
  TextField,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export function Bill({ bill, setBill, placeOrder, onCustomerInfoChange = null }) {
  const router = useRouter();
  const [isDashboard, setIsDashboard] = useState(false);
  useEffect(() => {
    setIsDashboard(router.query.dashboard === 'true');
  }, [router.query]);

  return (
    <Dialog open={true} fullWidth fullScreen>
      <DialogTitle>Bill</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: isDashboard ? 'flex' : 'block' }}>
          {isDashboard ? (
            <Box>
              <Box style={{ marginRight: 30, width: 300 }}>
                Customer Info
                <br />
                <br />
                <TextField
                  name="name"
                  onChange={onCustomerInfoChange}
                  fullWidth
                  size="small"
                  placeholder="Customer Name"
                />
                <br />
                <TextField
                  name="phone"
                  onChange={onCustomerInfoChange}
                  fullWidth
                  margin="dense"
                  size="small"
                  placeholder="Phone Number"
                />
                <br />
                <TextField
                  name="address"
                  onChange={onCustomerInfoChange}
                  fullWidth
                  InputProps={{ sx: { padding: 1 } }}
                  multiline
                  rows={3}
                  placeholder="Address"
                />
              </Box>
              {isDashboard && (
                <Box>
                  <br />
                  <br />
                  <Typography variant="body1">Discounts % : {bill.total ?? 0}</Typography>
                  <Typography variant="body1">Total: {bill.total}</Typography>
                  <Typography variant="body1">
                    Net Total: <strong>Rs.{bill.netAmount}</strong>
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            ''
          )}
          <TableContainer component={Paper} className={''} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bill.billItems.map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>{item.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {!isDashboard && (
            <Box>
              <br />
              <br />
              <Typography variant="body1">Discounts % : {bill.total ?? 0}</Typography>
              <Typography variant="body1">Total: {bill.total}</Typography>
              <Typography variant="body1">
                Net Total: <strong>Rs.{bill.netAmount}</strong>
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions style={{ justifyContent: 'space-between' }}>
        <Button onClick={() => setBill(null)} color="error">
          Close
        </Button>
        <Button onClick={placeOrder} variant="contained" color="success">
          Place Order
        </Button>
      </DialogActions>
    </Dialog>
  );
}
