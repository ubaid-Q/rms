import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  CircularProgress,
  Typography,
  Fab,
  IconButton,
  AppBar,
  Toolbar,
} from "@mui/material";
import { getTableOrders } from "./service";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { OrderCard } from "@/components/order/orderCard";
import { useRouter } from "next/router";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "@/components/common";
import { Order, OrderStatus } from "@/models";
import { enqueueSnackbar } from "notistack";

export default function Orders() {
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);
  const [tableOrders, setTableOrders] = useState<Order[]>([]);
  const [tableData, setTableData] = useState<any>({});

  function addNewOrder() {
    const pendingOrder = tableOrders.find(
      (order) => order.status === OrderStatus.PENDING
    );
    if (pendingOrder) {
      enqueueSnackbar(
        "There is already an ongoing order, Please complete/cancel it.",
        {
          variant: "warning",
        }
      );
      return;
    }
    window.location.href = `/menu?tableId=${router.query.tableId}&tableNo=${router.query.tableNo}`;
  }

  useEffect(() => {
    if ("tableId" in router.query) {
      setTableData({
        tableNo: router.query.tableNo,
        tableId: router.query.tableId,
      });
    }
  }, [router]);

  useEffect(() => {
    if (tableData.tableNo) {
      getTableOrders({
        baseUrl: window.location.hostname,
        setLoading,
        setTableOrders,
        tableNo: tableData.tableNo,
      });
    }
  }, [tableData]);

  return (
    <div style={{ position: "relative" }}>
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <CircularProgress color="secondary" />
        </div>
      )}
      <AppBar component="nav" elevation={0}>
        <Toolbar variant="dense">
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={() => router.push("/table")}
          >
            <ArrowBackIcon />
          </IconButton>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              // onChange={searchMenu}
            />
          </Search>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, ml: 2, color: "#ffffff" }}
          >
            Orders ({tableOrders.length}){" "}
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, ml: 2, color: "#ffffff" }}
          >
            Table No: {tableData.tableNo}
          </Typography>
        </Toolbar>
      </AppBar>

      <Grid container spacing={2} marginTop="70px" padding="10px">
        {tableOrders.map((order, index) => (
          <Grid key={index} item xs={12} sm={4} md={4} lg={3}>
            <OrderCard order={order} />
          </Grid>
        ))}
      </Grid>

      <Box
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1,
        }}
      >
        <Fab color="primary" aria-label="add" onClick={addNewOrder}>
          <AddIcon />
        </Fab>
      </Box>
    </div>
  );
}
