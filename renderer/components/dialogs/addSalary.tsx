import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Order, Payment } from "@/models";
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
} from "@mui/material";
import {
  Payments as CashIcon,
  Payment as CardIcon,
  AccountBalance as OnlineIcon,
} from "@mui/icons-material";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  open: boolean;
  setOpen: React.Dispatch<boolean>;
  onConfirm: any;
  staff: any;
}

export function AddSalary({ open, setOpen, onConfirm, staff }: Props) {
  const [data, setData] = React.useState({
    staffId: 0,
    amount: 0,
    description: "",
  });
  const handleChange = (e: any) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: +e.target.value ? +e.target.value : e.target.value,
    }));
  };

  React.useEffect(() => {
    if (staff)
      setData(() => ({ ...data, staffId: staff.id, amount: staff.salary }));
  }, [staff]);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => setOpen(false)}
      fullWidth
      PaperProps={{ sx: { width: "350px" } }}
    >
      <DialogTitle>Pay Salary to {staff?.name}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth variant="filled" margin="dense">
          <InputLabel htmlFor="amount">Amount</InputLabel>
          <FilledInput
            value={data?.amount}
            name="amount"
            type="text"
            inputMode="numeric"
            onChange={handleChange}
            startAdornment={
              <InputAdornment position="start">Rs.</InputAdornment>
            }
          />
        </FormControl>

        <FormControl fullWidth variant="filled" margin="dense">
          <InputLabel htmlFor="transactionId">Description</InputLabel>
          <FilledInput
            multiline
            rows={4}
            value={data?.description}
            name="description"
            onChange={handleChange}
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
