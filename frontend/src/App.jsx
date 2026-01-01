import React from "react";
import { Routes, Route } from "react-router-dom";

// LAYOUTS
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";

// PUBLIC PAGES
import Home from "./components/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Car from "./pages/Cars";
import About from "./pages/About";
import Contact from "./pages/Contact";

// ADMIN PAGES
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Invoice from "./pages/admin/charts/Invoice";
import AddCar from "./pages/admin/charts/AddCar";
import CreateCategory from "./pages/admin/charts/CreateCategory";
import CarList from "./pages/admin/charts/CarList";
import EditCar from "./pages/admin/charts/EditCar";
import MyBookings from "./pages/admin/charts/MyBooking";
import Booking from "./pages/admin/charts/Booking";
import Calendar from "./pages/admin/Calendar";
import AdminBookings from "./pages/admin/charts/AdminBookings";
import AdminPrivateRoute from "./pages/admin/charts/AdminPrivateRoute";
import AdminLogout from "./pages/admin/charts/AdminLogout";

// CHART PAGES
import Bar from "./pages/admin/charts/Bar";
import Geography from "./pages/admin/charts/Geography";
import Line from "./pages/admin/charts/Line";
import Pie from "./pages/admin/charts/Pie";

// ADMIN AUTH
import AdminLogin from "./pages/admin/charts/AdminLogin";
import AdminRegister from "./pages/admin/charts/AdminRegister";

const App = () => {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cars" element={<Car />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/mybooking" element={<MyBookings />} />
        <Route path="/invoice/:id" element={<Invoice />} />
      </Route>

      {/* ================= ADMIN AUTH ================= */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />

      {/* ================= ADMIN ROUTES ================= */}
      <Route path="/admin/*" element={<AdminPrivateRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} /> {/* /admin -> dashboard */}
          <Route path="users" element={<Users />} />
          <Route path="addcar" element={<AddCar />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="invoice/:id" element={<Invoice />} />
          <Route path="createcategory" element={<CreateCategory />} />
          <Route path="carlist" element={<CarList />} />
          <Route path="editcar/:id" element={<EditCar />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="bar" element={<Bar />} />
          <Route path="geography" element={<Geography />} />
          <Route path="line" element={<Line />} />
          <Route path="pie" element={<Pie />} />
          <Route path="logout" element={<AdminLogout />} />
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
