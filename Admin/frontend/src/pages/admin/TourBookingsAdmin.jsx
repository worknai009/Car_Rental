import React, { useEffect, useState } from "react";
import { 
  Box, Typography, useTheme, 
  Paper, Table, TableBody, 
  TableCell, TableContainer, 
  TableHead, TableRow, Select, 
  MenuItem, Chip 
} from "@mui/material";
import adminApi from "../../utils/adminApi";
import Header from "../../components/admin/Header";

const TourBookingsAdmin = () => {
  const theme = useTheme();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await adminApi.get("/admin/tours/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminApi.patch(`/admin/tours/bookings/${id}/status`, { status: newStatus });
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED": return "success";
      case "COMPLETED": return "info";
      case "CANCELLED": return "error";
      default: return "warning";
    }
  };

  return (
    <Box m="20px">
      <Header title="TOUR BOOKINGS" subtitle="Manage customer tour reservations" />

      <TableContainer component={Paper} sx={{ mt: 3, borderRadius: "15px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <Table>
          <TableHead sx={{ bgcolor: theme.palette.mode === 'dark' ? "#1F2A40" : "#f8f9fa" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tour Package</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Persons</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Total (₹)</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.id}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">{row.user_name}</Typography>
                  <Typography variant="caption" color="textSecondary">{row.user_email}</Typography>
                </TableCell>
                <TableCell>{row.tour_title}</TableCell>
                <TableCell>{new Date(row.start_date).toLocaleDateString()}</TableCell>
                <TableCell>{row.num_persons}</TableCell>
                <TableCell fontWeight="bold">₹{row.total_amount}</TableCell>
                <TableCell>
                  <Chip 
                    label={row.status} 
                    color={getStatusColor(row.status)} 
                    size="small" 
                    sx={{ fontWeight: "bold", minWidth: "90px" }}
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={row.status}
                    size="small"
                    onChange={(e) => handleStatusChange(row.id, e.target.value)}
                    sx={{ fontSize: "0.75rem", minWidth: "120px" }}
                  >
                    <MenuItem value="PENDING">PENDING</MenuItem>
                    <MenuItem value="CONFIRMED">CONFIRMED</MenuItem>
                    <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                    <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TourBookingsAdmin;
