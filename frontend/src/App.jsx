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
import Team from "./pages/admin/Team";
import Invoices from "./pages/admin/Invoices";
import Calendar from "./pages/admin/Calendar";

// ADMIN – CAR MANAGEMENT
import CarList from "./components/admin/cars/CarList";
import AddCar from "./components/admin/cars/AddCar";
import EditCar from "./components/admin/cars/EditCar";

// CHART PAGES
import Bar from "./pages/admin/charts/Bar";
import Geography from "./pages/admin/charts/Geography";
import Line from "./pages/admin/charts/Line";
import Pie from "./pages/admin/charts/Pie";

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
      </Route>

      {/* ================= ADMIN ROUTES ================= */}
      <Route path="/admin" element={<AdminLayout />}>
        {/* Dashboard */}
        <Route index element={<Dashboard />} />

        {/* Management */}
        <Route path="team" element={<Team />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="calendar" element={<Calendar />} />

        {/* Cars CRUD */}
        <Route path="cars" element={<CarList />} />
        <Route path="cars/add" element={<AddCar />} />
        <Route path="cars/edit/:id" element={<EditCar />} />

        {/* Charts */}
        <Route path="bar" element={<Bar />} />
        <Route path="geography" element={<Geography />} />
        <Route path="line" element={<Line />} />
        <Route path="pie" element={<Pie />} />
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
