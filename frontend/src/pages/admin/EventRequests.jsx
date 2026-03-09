import React, { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:1000" });

// attach admin token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function EventRequests() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== "ALL") params.status = statusFilter;
      const res = await api.get("/admin/event-requests", { params });
      setRows(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      setRows([]);
      alert("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/event-requests/${id}/status`, { status });
      fetchData();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h1 className="text-2xl font-black">Event Requests</h1>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="bg-white p-4 rounded-xl border">Loading...</div>
      ) : rows.length === 0 ? (
        <div className="bg-white p-4 rounded-xl border">No requests found.</div>
      ) : (
        <div className="bg-white rounded-xl border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">City</th>
                <th className="p-3 text-left">PickUp Location</th>
                <th className="p-3 text-left">Drop Location </th>

                <th className="p-3 text-left">Dates</th>
                <th className="p-3 text-left">Cars</th>
                <th className="p-3 text-left">Billing</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3 font-bold">#{r.id}</td>
                  <td className="p-3">
                    <div className="font-semibold">{r.user_name || "-"}</div>
                    <div className="text-xs text-gray-500">{r.user_email || "-"}</div>
                  </td>
                  <td className="p-3">{r.city}</td>
                  <td className="p-3">{r.pickup_location}</td>

                  <td className="p-3">{r.drop_location}</td>

                  <td className="p-3">
                    {String(r.start_date).slice(0, 10)} → {String(r.end_date).slice(0, 10)}
                    <div className="text-xs text-gray-500">time: {r.start_time || "-"}</div>
                  </td>
                  <td className="p-3">
                    qty: <b>{r.cars_qty}</b>
                    <div className="text-xs text-gray-500">
                      badge: {r.badge || "ANY"} | seats: {r.min_seats || "-"}
                    </div>
                  </td>
                  <td className="p-3">
                    {r.billing_type}
                    {r.distance_km ? <div className="text-xs text-gray-500">{r.distance_km} km</div> : null}
                  </td>
                  <td className="p-3">{r.phone}</td>
                  <td className="p-3">
                    <select
                      value={r.status}
                      onChange={(e) => updateStatus(r.id, e.target.value)}
                      className="border px-2 py-1 rounded-lg"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
