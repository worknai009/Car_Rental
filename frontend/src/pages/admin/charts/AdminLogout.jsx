// src/pages/admin/AdminLogout.jsx

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";

const AdminLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Remove the admin token
    localStorage.removeItem("adminToken");
    
    // Optional: If you store admin user info, remove that too
    localStorage.removeItem("adminUserInfo"); 

    // 2. Redirect the user to the admin login page after a short delay
    // This delay gives the user a moment to see the "Logging out..." message
    const timer = setTimeout(() => {
      // You should change '/admin/login' to your actual admin login route
      navigate("/admin/login");
    }, 500); // 0.5 second delay

    return () => clearTimeout(timer); // Cleanup the timer
  }, [navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        textAlign: 'center',
      }}
    >
      <CircularProgress sx={{ mb: 2 }} />
      <Typography variant="h5" color="text.secondary">
        Logging out...
      </Typography>
      <Typography variant="body1" color="text.secondary">
        You are being redirected to the login page.
      </Typography>
    </Box>
  );
};

export default AdminLogout;