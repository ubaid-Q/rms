import React, { useEffect, useState } from 'react';
import { Grid, Box, IconButton, CircularProgress, Typography, AppBar, Toolbar } from '@mui/material';
import MenuItem from '@/components/menuItem';
import { CreateOrder, generateBill, getMenuItems } from './service';
import SearchIcon from '@mui/icons-material/Search';
import { Confirmation } from '@/components/ConfirmationDialog';
import { Bill } from '@/components/bill';
import { useRouter } from 'next/router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Search, SearchIconWrapper, ShowOrderButton, StyledInputBase } from '@/components/common';

const Items = () => {
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [order, setOrder] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bill, setBill] = useState(null);
  const [tableInfo, setTableInfo] = useState(Object);
  const router = useRouter();

  useEffect(() => {
    getMenuItems({
      setLoading,
      setAllMenuItems,
      baseUrl: window.location.hostname,
    });
  }, []);

  useEffect(() => {
    setMenuItems(allMenuItems);
  }, [allMenuItems]);

  useEffect(() => {
    setTableInfo({
      tableId: router.query.tableId,
      tableNo: router.query.tableNo,
    });
  }, [order, router]);

  function placeOrder() {
    CreateOrder(+tableInfo.tableId, order, window.location.hostname);
    window.location.href = `/orders?tableId=${router.query.tableId}&tableNo=${router.query.tableNo}`;
    // router.push("/orders", { query: tableInfo });
  }

  function handleBackConfirmation(confirm: boolean) {
    if (confirm) {
      window.history.back();
    } else {
      setShowConfirmation(false);
    }
  }

  function back() {
    setShowConfirmation(true);
  }

  function showOrder() {
    const bill = generateBill(order, menuItems) as any;
    setBill(bill);
  }

  function searchMenu(e: any) {
    const value = String(e.target?.value).toLowerCase().trim();
    if (!value.length) {
      setMenuItems(allMenuItems);
      return;
    }
    const searched = allMenuItems.filter((item: any) => String(item.name).toLowerCase().trim().includes(value));
    setMenuItems(searched);
  }

  return (
    <>
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <CircularProgress color="secondary" />
        </div>
      )}
      <Box sx={{ display: 'flex' }}>
        <AppBar component="nav" elevation={0}>
          <Toolbar variant="dense">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
              onClick={back}
            >
              <ArrowBackIcon />
            </IconButton>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} onChange={searchMenu} />
            </Search>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 2, color: '#ffffff' }}>
              Table No: {tableInfo.tableNo}
            </Typography>

            <ShowOrderButton onClick={showOrder}>Show Order</ShowOrderButton>
          </Toolbar>
        </AppBar>

        <Grid sx={{ mt: 10 }} container rowGap={5} paddingX={2}>
          {menuItems.map((item, index) => (
            <Grid item key={index} sm={4} lg={4} md={4}>
              <MenuItem order={order} item={item} setOrder={setOrder} />
            </Grid>
          ))}
        </Grid>
        {/* <Box component="main" sx={{ mt: 10 }}></Box> */}
        <Confirmation
          open={showConfirmation}
          onCancel={handleBackConfirmation}
          onConfirm={handleBackConfirmation}
          setOpen={setShowConfirmation}
          message={'Are you sure you want to go back? All your orders will be lost.'}
        />
        {bill && <Bill bill={bill} setBill={setBill} placeOrder={placeOrder} />}
      </Box>
    </>
  );
};

export default Items;
