// src/pages/admin/Bookings.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Header from "../../../components/admin/Header";
import { Link } from "react-router-dom";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:1000/admin/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setLoading(false);
    }
  };

 const handleStatusChange = async (id, status) => {
  const token = localStorage.getItem("adminToken");

  try {
    await axios.put(
      `http://localhost:1000/admin/bookings/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 🔥 Refresh table
    fetchBookings();

    alert(`Booking ${status} successfully`);
  } catch (err) {
    console.error(err);
    alert("Failed to update booking status");
  }
};



  const columns = [
    { field: "id", headerName: "Booking ID", width: 100 },
    { field: "user_name", headerName: "Customer Name", flex: 1 },
    { field: "user_email", headerName: "Email", flex: 1 },
    { field: "car_name", headerName: "Car", flex: 1 },
    { field: "start_date", headerName: "Start Date", flex: 1 },
    { field: "end_date", headerName: "End Date", flex: 1 },
    {
      field: "total_amount",
      headerName: "Total Amount (₹)",
      flex: 1,
      renderCell: (params) => (
        <Typography fontWeight="bold">₹{params.value}</Typography>
      ),
    },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 2,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            component={Link}
            to={`/admin/invoice/${params.row.id}`}
          >
            View Invoice
          </Button>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => handleStatusChange(params.row.id, "approved")}
          >
            Approve
          </Button>

          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleStatusChange(params.row.id, "rejected")}
          >
            Reject
          </Button>

        </Stack>
      ),
    }


  ];

  return (
    <Box m="20px">
      <Header title="BOOKINGS" subtitle="All bookings in the system" />
      <Box
        mt="20px"
        height="70vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#111827",
            color: "#fff",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "#111827",
            color: "#fff",
          },
        }}
      >
        <DataGrid
          rows={bookings}
          columns={columns}
          getRowId={(row) => row.id}
          loading={loading}

        />
      </Box>
    </Box>
  );
};

export default AdminBookings;
