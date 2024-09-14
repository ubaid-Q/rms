import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

export function Confirmation({
  message,
  open,
  setOpen,
  onCancel,
  onConfirm,
}: {
  message: string;
  open: boolean;
  setOpen: Function;
  onCancel: Function;
  onConfirm: Function;
}) {
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button onClick={() => onCancel(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={() => onConfirm(true)} color="primary" autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
