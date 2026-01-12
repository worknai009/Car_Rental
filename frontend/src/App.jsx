import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// LAYOUTS
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";

// PUBLIC PAGES
import Home from "./components/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Car from "./pages/CarsPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ReviewBooking from "./pages/ReviewBooking";
import MyBookings from "./pages/MyBookings";
import CarDetails from "./pages/CarDetails";


// ADMIN PAGES
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import Team from "./pages/admin/Team";
import Invoices from "./pages/admin/Invoices";
import Calendar from "./pages/admin/Calendar";
import AdminRegister from "./pages/admin/AdminRegister";
import CategoryList from "./pages/admin/CategoryList";
import AddCategory from "./pages/admin/AddCategory";
import EditCar from "./pages/admin/EditCar";
import ContactList from "./pages/admin/ContactList";
import CancelRequests from "./pages/admin/CancelRequests";

// ADMIN – CAR MANAGEMENT
import AddCar from "./pages/admin/AddCar";
import CarList from "./pages/admin/CarList";
import BookingList from "./pages/admin/BookingList";

// CHART PAGES
import Bar from "./pages/admin/charts/Bar";
import Geography from "./pages/admin/charts/Geography";
import Line from "./pages/admin/charts/Line";
import Pie from "./pages/admin/charts/Pie";

// ✅ Admin Protect
const AdminPrivateRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/admin/login" replace />;
};

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

        {/* ✅ PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ PROTECTED (as you want) */}
        <Route
          path="/cars"
          element={
            <UserPrivateRoute>
              <Car />
            </UserPrivateRoute>
          }
        />

        <Route
          path="/cars/:id"
          element={
            <UserPrivateRoute>
              <CarDetails />
            </UserPrivateRoute>
          }
        />
        


        <Route
          path="/review-booking"
          element={
            <UserPrivateRoute>
              <ReviewBooking />
            </UserPrivateRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <UserPrivateRoute>
              <MyBookings />
            </UserPrivateRoute>
          }
        />

        {/* ✅ PUBLIC */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* ================= ADMIN LOGIN ================= */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />

      {/* ================= ADMIN ROUTES ================= */}
      <Route
        path="/admin"
        element={
          <AdminPrivateRoute>
            <AdminLayout />
          </AdminPrivateRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="team" element={<Team />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="categories/add" element={<AddCategory />} />
        <Route path="categories" element={<CategoryList />} />
        <Route path="cars/add" element={<AddCar />} />
        <Route path="cars" element={<CarList />} />
        <Route path="bookings" element={<BookingList />} />
        <Route path="cars/edit/:id" element={<EditCar />} />
        <Route path="bar" element={<Bar />} />
        <Route path="geography" element={<Geography />} />
        <Route path="line" element={<Line />} />
        <Route path="pie" element={<Pie />} />
        <Route path="contacts" element={<ContactList />} />
        <Route path="/admin/cancel-requests" element={<CancelRequests />} />
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
