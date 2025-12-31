import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminPrivateRoute = () => {
  const isAdminLoggedIn = localStorage.getItem("adminToken"); // check login

  // If logged in, render nested admin routes
  // Otherwise, redirect to login
  return isAdminLoggedIn ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default AdminPrivateRoute;
