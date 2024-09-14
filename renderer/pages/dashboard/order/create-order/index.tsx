import React, { useEffect, useState } from 'react';
import { Grid, CircularProgress, Container, useTheme, Button } from '@mui/material';
import MenuItem from '@/components/menuItem';
import SearchIcon from '@mui/icons-material/Search';
import { Confirmation } from '@/components/ConfirmationDialog';
import { Bill } from '@/components/bill';
import { Search, SearchIconWrapper, ShowOrderButton, StyledInputBase } from '@/components/common';
import { CreateOrder, generateBill, getMenuItems } from '@/pages/menu/service';
import { Navbar } from '@/components/appbar';
import { useRouter } from 'next/router';
import { config } from '@/config/config';

const AddNewOrder = ({ darkMode, toggleDarkMode }) => {
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [order, setOrder] = useState({});
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bill, setBill] = useState(null);
  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    getMenuItems({
      setLoading,
      setAllMenuItems,
      baseUrl: config.host,
    });
  }, []);

  useEffect(() => {
    setMenuItems(allMenuItems);
  }, [allMenuItems]);

  function placeOrder() {
    CreateOrder(null, order, config.host, customerInfo, 'PARCEL');
    router.push('/dashboard/order');
  }

  function handleBackConfirmation(confirm: boolean) {
    if (confirm) {
      window.history.back();
    } else {
      setShowConfirmation(false);
    }
  }

  function showOrder() {
    const bill = generateBill(order, allMenuItems) as any;
    setBill(bill);
  }

  useEffect(() => {
    console.log('===ORDER', order);
  }, [order]);

  function searchMenu(e: any) {
    const value = String(e.target?.value).toLowerCase().trim();
    if (!value.length) {
      setMenuItems(allMenuItems);
      return;
    }
    const searched = allMenuItems.filter((item: any) => String(item.name).toLowerCase().trim().includes(value));
    setMenuItems(searched);
    console.log({ order });
  }

  function handleCustomerInfo(e) {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
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
      <Container
        style={{
          maxWidth: '100%',
          height: '100%',
          minHeight: '100vh',
          padding: theme.spacing(3),
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} heading={'New Order'} route="/dashboard">
          <Search sx={{ backgroundColor: theme.palette.background.default }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} onChange={searchMenu} />
          </Search>
          <Button sx={{ textTransform: 'none' }} variant="contained" onClick={showOrder}>
            Show Order
          </Button>
        </Navbar>

        <Grid sx={{ mt: 4 }} container rowGap={5} paddingX={2}>
          {menuItems.map((item, index) => (
            <Grid item key={index} sm={4} lg={3} md={4}>
              <MenuItem item={item} setOrder={setOrder} order={order} darkMode={darkMode} />
            </Grid>
          ))}
        </Grid>
        <Confirmation
          open={showConfirmation}
          onCancel={handleBackConfirmation}
          onConfirm={handleBackConfirmation}
          setOpen={setShowConfirmation}
          message={'Are you sure you want to go back? All your orders will be lost.'}
        />
        {bill && (
          <Bill bill={bill} setBill={setBill} placeOrder={placeOrder} onCustomerInfoChange={handleCustomerInfo} />
        )}
      </Container>
    </>
  );
};

export default AddNewOrder;
