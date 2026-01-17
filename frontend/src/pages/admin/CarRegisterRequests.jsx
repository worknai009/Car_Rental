import React, { useEffect, useState } from "react";
import adminApi from "../../utils/adminApi";

const CarRegisterRequests = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/admin/car-requests");
      setCars(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load car requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const approveCar = async (id) => {
    if (!window.confirm("Approve this car and publish it?")) return;
    try {
      await adminApi.post(`/admin/car-requests/${id}/approve`);
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Approve failed");
    }
  };

  const rejectCar = async (id) => {
    const reason = prompt("Enter reject reason");
    if (!reason) return;

    try {
      await adminApi.post(`/admin/car-requests/${id}/reject`, { reason });
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Reject failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">
          Car Register Requests
        </h1>
        <p className="text-sm text-gray-500">
          Review and approve cars submitted by users
        </p>
      </div>

      {/* Content */}
      <div className="bg-white rounded-3xl border border-gray-200/60 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 text-gray-600">Loading...</div>
        ) : cars.length === 0 ? (
          <div className="p-6 text-gray-600">
            No car registration requests found.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Car</th>
                <th className="px-4 py-3 text-left">Brand</th>
                <th className="px-4 py-3 text-left">City</th>
                <th className="px-4 py-3 text-left">Fuel</th>
                <th className="px-4 py-3 text-left">Seats</th>
                <th className="px-4 py-3 text-left">Price / Day</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {cars.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="px-4 py-3 font-semibold">{c.name}</td>
                  <td className="px-4 py-3">{c.brand}</td>
                  <td className="px-4 py-3">{c.city}</td>
                  <td className="px-4 py-3">{c.fuel_type}</td>
                  <td className="px-4 py-3">{c.seats}</td>
                  <td className="px-4 py-3">₹{c.price_per_day}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        c.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : c.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => approveCar(c.id)}
                      disabled={c.status !== "PENDING"}
                      className="px-4 py-1.5 rounded-lg bg-green-600 text-white font-semibold disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => rejectCar(c.id)}
                      disabled={c.status !== "PENDING"}
                      className="px-4 py-1.5 rounded-lg bg-red-600 text-white font-semibold disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CarRegisterRequests;
