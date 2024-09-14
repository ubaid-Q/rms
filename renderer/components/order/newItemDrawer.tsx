import { CloseRounded } from '@mui/icons-material';
import { Box, Button, Grid, SwipeableDrawer, Typography } from '@mui/material';
import { ReactEventHandler, useState } from 'react';
import MenuItem from '../menuItem';

export function NewOrderItem({
  toggleDrawer,
  open,
  menuItems,
  onConfirm,
}: {
  toggleDrawer: ReactEventHandler;
  open: boolean;
  menuItems: any[];
  onConfirm: ReactEventHandler;
}) {
  const [order, setOrder] = useState({});
  return (
    <SwipeableDrawer
      anchor={'bottom'}
      open={open}
      onClose={toggleDrawer}
      onOpen={toggleDrawer}
      PaperProps={{
        sx: { height: '-webkit-fill-available', backgroundColor: 'whitesmoke' },
      }}
    >
      <Box
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: 10,
        }}
      >
        <Button onClick={onConfirm.bind(order)} style={{ borderRadius: 20 }} variant="contained">
          Confirm
        </Button>
        <Typography variant="h5">Add New Item</Typography>

        <CloseRounded
          style={{
            backgroundColor: 'red',
            borderRadius: '6px',
            color: 'white',
          }}
          onClick={toggleDrawer}
        />
      </Box>
      <Grid container rowGap={5} paddingX={2}>
        {menuItems.map((item, index) => (
          <Grid item key={index} sm={4} lg={3} md={4}>
            <MenuItem order={order} item={item} setOrder={setOrder} />
          </Grid>
        ))}
      </Grid>
    </SwipeableDrawer>
  );
}
