import React, { useEffect, useState } from "react";
import carRegisterApi from "../../utils/carRegisterApi";

const StatCard = ({ label, value }) => (
  <div className="p-5 rounded-2xl bg-white border border-gray-200/60 shadow-sm">
    <div className="text-sm text-gray-500 font-bold">{label}</div>
    <div className="text-3xl font-black mt-2">{value}</div>
  </div>
);

const CarRegisterDashboard = () => {
  const [stats, setStats] = useState({
    total_cars: 0,
    approved_cars: 0,
    pending_cars: 0,
    rejected_cars: 0,
    total_bookings: 0,
    total_revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await carRegisterApi.get("/dashboard/stats");
      setStats({
        total_cars: res.data?.total_cars ?? 0,
        approved_cars: res.data?.approved_cars ?? 0,
        pending_cars: res.data?.pending_cars ?? 0,
        rejected_cars: res.data?.rejected_cars ?? 0,
        total_bookings: res.data?.total_bookings ?? 0,
        total_revenue: res.data?.total_revenue ?? 0,
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-4">
      <div className="text-2xl font-black text-gray-900">Dashboard</div>

      {loading ? (
        <div className="p-6 rounded-2xl bg-white border border-gray-200/60 shadow-sm text-gray-600">
          Loading...
        </div>
      ) : (
        <div className="grid sm:grid-cols-3 gap-4">
          <StatCard label="Total Cars" value={stats.total_cars} />
          <StatCard label="Approved Cars" value={stats.approved_cars} />
          <StatCard label="Pending Cars" value={stats.pending_cars} />
          <StatCard label="Rejected Cars" value={stats.rejected_cars} />
          <StatCard label="Total Bookings" value={stats.total_bookings} />
          <StatCard label="Total Revenue" value={`₹${stats.total_revenue}`} />

        </div>
      )}
    </div>
  );
};

export default CarRegisterDashboard;
