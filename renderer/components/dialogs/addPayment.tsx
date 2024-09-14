import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Order, Payment } from '@/models';
import {
  Box,
  FilledInput,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { Payments as CashIcon, Payment as CardIcon, AccountBalance as OnlineIcon } from '@mui/icons-material';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  open: boolean;
  setOpen: React.Dispatch<boolean>;
  onConfirm: any;
  order: Order;
}

export function AddOrderPayment(this: any, { open, setOpen, onConfirm, order }: Props) {
  const [data, setData] = React.useState<Payment>(Object);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    setData((prev) => ({ ...prev, [e.target.name]: +e.target.value ? +e.target.value : e.target.value }));
  };

  React.useEffect(() => {
    setData({ ...data, amount: order.totalAmount, orderId: order.id });
  }, [order]);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => setOpen(false)}
      fullWidth
      PaperProps={{ sx: { width: '350px' } }}
    >
      <DialogTitle>Pay to Order (#000{order.id})</DialogTitle>
      <DialogContent>
        <FormControl fullWidth variant="filled" margin="dense">
          <InputLabel htmlFor="amount">Amount</InputLabel>
          <FilledInput
            value={data?.amount}
            name="amount"
            type="text"
            inputMode="numeric"
            onChange={handleChange}
            startAdornment={<InputAdornment position="start">Rs.</InputAdornment>}
          />
        </FormControl>
        <FormControl fullWidth variant="filled" margin="dense">
          <InputLabel htmlFor="amount">Payment Method</InputLabel>
          <Select
            name="paymentMethod"
            value={data?.paymentMethod}
            onChange={handleChange}
            startAdornment={
              <InputAdornment position="start">
                {data.paymentMethod === 'card' ? (
                  <CardIcon fontSize="small" />
                ) : data.paymentMethod === 'cash' ? (
                  <CashIcon fontSize="small" />
                ) : (
                  <OnlineIcon fontSize="small" />
                )}
              </InputAdornment>
            }
          >
            <MenuItem value={'cash'}>Cash</MenuItem>
            <MenuItem value={'online'}>Online</MenuItem>
            <MenuItem value={'card'}>Card</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth variant="filled" margin="dense">
          <InputLabel htmlFor="transactionId">Transaction Id (Required if Online/Card)</InputLabel>
          <FilledInput
            value={data?.transactionId}
            name="transactionId"
            onChange={handleChange}
            startAdornment={<InputAdornment position="start">#</InputAdornment>}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={() => onConfirm(data)}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}
