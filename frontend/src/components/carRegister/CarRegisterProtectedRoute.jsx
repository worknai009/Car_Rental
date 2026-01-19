import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCarRegisterAuth } from "./CarRegisterAuthContext";

const CarRegisterProtectedRoute = () => {
  const { token } = useCarRegisterAuth();
  const location = useLocation();

return token ? <Outlet /> : <Navigate to="/car-register/login" replace />;
};

export default CarRegisterProtectedRoute;
 
