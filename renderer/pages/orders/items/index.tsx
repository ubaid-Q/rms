import React, { useEffect, useState } from "react";
import { Grid, Typography, Box, IconButton, Button } from "@mui/material";
import {
  AddNewItems,
  cancelOrder,
  deleteOrderItem,
  getMenuItems,
  getOrderItems,
} from "../service";
import {
  Event,
  Description,
  MonetizationOn,
  CheckCircle,
  ArrowBack,
  Home,
  Cancel,
  Add,
} from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import Link from "next/link";
import OrderItem from "@/components/menuItem/viewItem";
import { useRouter } from "next/router";
import { Confirmation } from "@/components/ConfirmationDialog";
import { NewOrderItem } from "@/components/order/newItemDrawer";

const useStyles = makeStyles((theme: any) => ({
  container: {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.grey[100],
    minHeight: "100vh",
  },
  detailBox: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(1),
  },
  icon: {
    marginRight: theme.spacing(1),
    fontSize: 35,
    color: "ThreeDDarkShadow",
  },
  headerIcon: {
    marginRight: theme.spacing(1),
    fontSize: 30,
    color: "black",
  },
}));

const DetailBox = ({ icon, title, value }: any) => {
  const classes = useStyles();
  return (
    <Box className={classes.detailBox}>
      {icon}
      <Box style={{ marginBottom: "10px" }}>
        <Typography variant="subtitle1" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" fontWeight={800} lineHeight={0}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

const getStatusIcon = (
  status: string,
  classes: ReturnType<typeof useStyles>
) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return <Event className={classes.icon} />;
    case "cooking":
      return <Description className={classes.icon} />;
    case "canceled":
      return <MonetizationOn className={classes.icon} />;
    case "completed":
      return <CheckCircle className={classes.icon} />;
    default:
      return null;
  }
};

function Item() {
  const classes = useStyles();
  const router = useRouter();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [order, setOrder] = useState(Object);
  const [openDrawer, setDrawer] = React.useState(false);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const orderId = router.query.orderId as any;
    void getOrderItems({
      orderId,
      setLoading,
      setOrder,
      baseUrl: window.location.hostname,
    });
  }, [router]);

  function handleCancelOrder(this: any) {
    if (this.confirm) {
      cancelOrder(order.id, window.location.hostname);
      router.back();
    }
    setShowConfirmation(this.showConfirmation);
  }

  const toggleDrawer = () => {
    if (!menuItems.length) {
      getMenuItems({
        setLoading,
        setMenuItems,
        baseUrl: window.location.hostname,
      });
    }
    setDrawer(!openDrawer);
  };

  function confirmAddItems(this: any) {
    const orderId = router.query.orderId as any;
    AddNewItems(this, orderId, setOrder, window.location.hostname);
    setDrawer(!openDrawer);
  }

  return (
    <div className={classes.container}>
      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          <Grid container alignItems="center" justifyContent="space-between">
            <DetailBox
              icon={getStatusIcon(order?.status, classes)}
              title="Order ID"
              value={"#00" + order?.id}
            />
            <DetailBox
              icon={<Event className={classes.icon} />}
              title="Date"
              value={new Date(order?.createdAt).toDateString()}
            />
            <DetailBox
              icon={<Description className={classes.icon} />}
              title="Status"
              value={order?.status}
            />
            <DetailBox
              icon={<CheckCircle className={classes.icon} />}
              title="Total Price"
              value={"Rs. " + order?.totalAmount + "/-"}
            />
          </Grid>
          <div
            style={{
              marginBottom: "20px",
              alignItems: "end",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <IconButton
              onClick={() => window.history.back()}
              className={classes.headerIcon}
            >
              <ArrowBack />
            </IconButton>
            <Typography
              variant="h6"
              align="center"
              style={{ marginTop: "20px" }}
            >
              Order Items ({order?.items.length})
            </Typography>
            <Box style={{ display: "flex", alignItems: "center" }}>
              <Button
                style={{ marginRight: 20 }}
                onClick={toggleDrawer}
                size="small"
                color="warning"
              >
                Add Items <Add />
              </Button>
              {/* {order?.status != "CANCELED" && (
                <Cancel
                  style={{ marginRight: 20, color: "red" }}
                  onClick={handleCancelOrder.bind({ showConfirmation: true })}
                />
              )} */}
              <Link href={{ pathname: "/table" }}>
                <Home className={classes.headerIcon} />
              </Link>
            </Box>
          </div>

          <Grid container style={{ marginTop: "10px" }}>
            {order?.items?.map((item: any, index: number) => (
              <OrderItem
                key={index}
                item={item}
                onConfirmDelete={deleteOrderItem.bind(
                  {
                    orderId: order?.id,
                    setLoading,
                    setOrder,
                    baseUrl: window.location.hostname,
                  },
                  order?.id
                )}
              />
            ))}
          </Grid>
          <Confirmation
            open={showConfirmation}
            onCancel={handleCancelOrder.bind({ showConfirmation: false })}
            onConfirm={handleCancelOrder.bind({ confirm: true })}
            setOpen={setShowConfirmation}
            message={"Are you sure you want to delete the order?"}
          />
        </>
      )}

      <NewOrderItem
        open={openDrawer}
        toggleDrawer={toggleDrawer}
        menuItems={menuItems}
        onConfirm={confirmAddItems}
      />
    </div>
  );
}

export default Item;
