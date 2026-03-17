import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// LAYOUTS
import AdminLayout from "./components/AdminLayout";

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
import FeedbackList from "./pages/admin/FeedbackList.jsx";
import CarRegisterRequests from "./pages/admin/CarRegisterRequests.jsx";
import CarRegisterUsers from "./pages/admin/CarRegisterUsers.jsx"
import EventRequests from "./pages/admin/EventRequests";
import ToursList from "./pages/admin/ToursList";
import AddTour from "./pages/admin/AddTour";
import TourBookingsAdmin from "./pages/admin/TourBookingsAdmin";
import TourDetailsAdmin from "./pages/admin/TourDetailsAdmin";

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
  const user = JSON.parse(localStorage.getItem("admin"));
  return user && user.role === 'admin' ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Routes>
      {/* ================= ADMIN AUTH ================= */}
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/register" element={<AdminRegister />} />

      {/* ================= ADMIN DASHBOARD ================= */}
      <Route path="/" element={<AdminPrivateRoute><AdminLayout /></AdminPrivateRoute>}>
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
        <Route path="cancel-requests" element={<CancelRequests />} />
        <Route path="feedback" element={<FeedbackList />} />
        <Route path="car-register-requests" element={<CarRegisterRequests />} />
        <Route path="car-register-users" element={<CarRegisterUsers />} />
        <Route path="event-requests" element={<EventRequests />} />
        <Route path="tours" element={<ToursList />} />
        <Route path="tours/:id" element={<TourDetailsAdmin />} />
        <Route path="tours/add" element={<AddTour />} />
        <Route path="tours/edit/:id" element={<AddTour />} />
        <Route path="tour-bookings" element={<TourBookingsAdmin />} />
      </Route>

      {/* ================= 404 ================= */}
      <Route
        path="*"
        element={
          <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
            <div className="text-center">
                <h1 className="text-6xl font-bold mb-4">404</h1>
                <h2 className="text-2xl font-bold mb-6">Page Not Found</h2>
                <a href="/" className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition">Go to Dashboard</a>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

export default App;
