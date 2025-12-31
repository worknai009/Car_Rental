import { Box, Typography, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../../components/admin/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Invoices = () => {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get("http://localhost:1000/admin/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRows(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch bookings");
    }
  };

  const columns = [
    { field: "booking_id", headerName: "Booking ID", width: 100 },
    { field: "user_name", headerName: "Customer Name", flex: 1 },
    { field: "user_email", headerName: "Email", flex: 1 },
    { field: "car_name", headerName: "Car", flex: 1 },
    { field: "start_date", headerName: "Start Date", flex: 1 },
    { field: "end_date", headerName: "End Date", flex: 1 },
    {
      field: "total_amount",
      headerName: "Amount (₹)",
      flex: 1,
      renderCell: (params) => (
        <Typography fontWeight="bold" color="#16a34a">
          ₹{params.row.total_amount}
        </Typography>
      ),
    },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "action",
      headerName: "Invoice",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate(`/admin/invoice/${params.row.booking_id}`)}
        >
          View Invoice
        </Button>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="INVOICES" subtitle="All Bookings and Invoices" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": { backgroundColor: "#111827", color: "#fff" },
          "& .MuiDataGrid-footerContainer": { backgroundColor: "#111827", color: "#fff" },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.booking_id}
        />
      </Box>
    </Box>
  );
};

export default Invoices;
