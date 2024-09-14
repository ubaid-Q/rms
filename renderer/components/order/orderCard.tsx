import Image from "next/image";
import { Card, CardContent, Typography, Box } from "@mui/material";
import Link from "next/link";

const OrderStatus = {
  PENDING: "yellowgreen",
  COOKING: "orange",
  COMPLETED: "green",
  CANCELED: "red",
};

export function OrderCard({ order }: any) {
  return (
    <Link
      href={{ pathname: "/orders/items", query: { orderId: order.id } }}
      passHref
      style={{ textDecoration: "none" }}
    >
      <Card
        variant="outlined"
        sx={{
          borderRadius: "20px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#ffffff",
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.02)",
          },
          padding: 0,
        }}
      >
        <CardContent sx={{ paddingBottom: 0, textTransform: "none" }}>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            #{order.id}
          </Typography>
          <Typography variant="h5" component="div">
            Rs. {order.totalAmount} /-
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Status:{" "}
              <span
                style={{
                  fontWeight: "bolder",
                  color: OrderStatus[order.status as keyof typeof OrderStatus],
                }}
              >
                {order.status}
              </span>
            </Typography>
            <Image
              src={
                order.status === "PENDING"
                  ? "/pending.gif"
                  : order.status === "COOKING"
                  ? "/cooking1.gif"
                  : order.status === "COMPLETED"
                  ? "/completed.gif"
                  : "/cancel.gif"
              }
              alt=".."
              width={40}
              height={40}
            />{" "}
          </Box>
          <br />
        </CardContent>
        <Box style={{ marginLeft: "20px", marginBottom: "15px" }}>
          <Typography
            variant="body2"
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              textTransform: "none",
            }}
          >
            Total Items: {order.items.length}
          </Typography>
          <Typography
            variant="body2"
            style={{ marginLeft: "auto", marginRight: "auto" }}
          >
            {new Date(order.createdAt).toLocaleString()}{" "}
          </Typography>
        </Box>
      </Card>
    </Link>
  );
}
