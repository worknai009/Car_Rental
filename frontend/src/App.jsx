import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// LAYOUTS
import Layout from "./components/Layout";

// PUBLIC PAGES
import Home from "./components/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CarsPage from "./pages/CarsPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ReviewBooking from "./pages/ReviewBooking";
import MyBookings from "./pages/MyBookings";
import CarDetails from "./pages/CarDetails";
import ResetPassword from "./pages/ResetPassword.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import EventsPage from "./pages/EventsPage";
import ToursPage from "./pages/ToursPage";
import TourDetails from "./pages/TourDetails";
import TourBookingsUser from "./pages/TourBookingsUser";

// ✅ Car Register Panel
import { CarRegisterAuthProvider } from "./components/carRegister/CarRegisterAuthContext.jsx";
import CarRegisterProtectedRoute from "./components/carRegister/CarRegisterProtectedRoute.jsx";
import CarRegisterLayout from "./components/carRegister/CarRegisterLayout.jsx";

import CarRegisterLogin from "./pages/carRegister/CarRegisterLogin.jsx";
import CarRegisterRegister from "./pages/carRegister/CarRegisterRegister.jsx";
import CarRegisterDashboard from "./pages/carRegister/CarRegisterDashboard.jsx";
import CarRegisterCars from "./pages/carRegister/CarRegisterCars.jsx";
import CarRegisterAddCar from "./pages/carRegister/CarRegisterAddCar.jsx";
import CarRegisterBookings from "./pages/carRegister/CarRegisterBookings.jsx";
import CarRegisterProfile from "./pages/carRegister/CarRegisterProfile.jsx";
import CarRegisterTours from "./pages/carRegister/CarRegisterTours.jsx";
import CarRegisterAddTour from "./pages/carRegister/CarRegisterAddTour.jsx";
import TourDetailsPartner from "./pages/carRegister/TourDetailsPartner.jsx";

// ✅ User Protect (redirect back after login)
const UserPrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  return token ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

const App = () => {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cars" element={<CarsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/cars/:id" element={<CarDetails />} />
        <Route path="/review-booking"  element={  <UserPrivateRoute>  <ReviewBooking />  </UserPrivateRoute>  }  />
        <Route path="/my-bookings"  element={  <UserPrivateRoute>  <MyBookings />  </UserPrivateRoute>  } />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/tours" element={<ToursPage />} />
        <Route path="/tours/:id" element={<TourDetails />} />
        <Route path="/my-tours" element={<UserPrivateRoute> <TourBookingsUser /> </UserPrivateRoute>} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* ✅ Car Register Auth (public) */}
      <Route path="/car-register/login" element={  <CarRegisterAuthProvider>  <CarRegisterLogin /> </CarRegisterAuthProvider>}/>
      <Route path="/car-register/register" element={ <CarRegisterAuthProvider>  <CarRegisterRegister /> </CarRegisterAuthProvider> } />

      {/* ✅ Car Register Panel (protected) */}
      <Route element={ <CarRegisterAuthProvider> <CarRegisterProtectedRoute />  </CarRegisterAuthProvider>}>
        <Route path="/car-register" element={<CarRegisterLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<CarRegisterDashboard />} />
          <Route path="cars" element={<CarRegisterCars />} />
          <Route path="cars/add" element={<CarRegisterAddCar />} />
          <Route path="bookings" element={<CarRegisterBookings />} />
          <Route path="profile" element={<CarRegisterProfile />} />
          <Route path="tours" element={<CarRegisterTours />} />
          <Route path="tours/:id" element={<TourDetailsPartner />} />
          <Route path="tours/add" element={<CarRegisterAddTour />} />
          <Route path="tours/edit/:id" element={<CarRegisterAddTour />} />
        </Route>
      </Route>

      {/* ================= 404 ================= */}
      <Route
        path="*"
        element={
          <div className="flex items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
          </div>
        }
      />
    </Routes>
  );
};

export default App;
