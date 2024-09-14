import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Box,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Refresh } from "@mui/icons-material";
import ChefIcon from "@/components/chef_icon/chef_icon.svg";
import { getTables } from "./service";
import { Table } from "@/components/table";
import Link from "next/link";

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getTables({ baseUrl: window.location.hostname, setLoading, setTables });
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
        <Typography variant="h4" component="h1" sx={{ mr: 2 }}>
          RMS Restaurant
        </Typography>
        <ChefIcon width={120} height={120} />
      </Box>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <IconButton onClick={handleRefresh}>
          <Refresh />
        </IconButton>
      </Box>
      {isLoading ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="50vh"
        >
          <CircularProgress color="secondary" />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {tables.map(({ id, tableNo, status }) => (
            <Link
              href={{ pathname: "/orders", query: { tableId: id, tableNo } }}
            >
              <Table key={id} status={status} tableNo={tableNo} />
            </Link>
          ))}
        </Grid>
      )}
    </Box>
  );
}
