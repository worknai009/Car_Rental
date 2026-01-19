import React, { useEffect, useState } from "react";
import carRegisterApi from "../../utils/carRegisterApi";

const CarRegisterBookings = () => {

  const OWNER_STATUS = ["CONFIRMED", "COMPLETED", "CANCEL_REQUESTED"];
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toISOString().split("T")[0];
  };


  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await carRegisterApi.get("/bookings/my");
      setRows(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId, status) => {
    try {
      await carRegisterApi.patch(`/bookings/${bookingId}/status`, { status });
      setRows((prev) =>
        prev.map((r) =>
          r.booking_id === bookingId ? { ...r, status } : r
        )
      );
      alert("Status updated ✅");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="space-y-4">
      <div className="text-2xl font-black text-gray-900">Bookings</div>

      <div className="bg-white border border-gray-200/60 shadow-sm rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6 text-gray-600">Loading...</div>
        ) : rows.length === 0 ? (
          <div className="p-6 text-gray-600">No bookings found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">Booking ID</th>
                  <th className="px-4 py-3 text-left">Car</th>
                  <th className="px-4 py-3 text-left">Pickup</th>
                  <th className="px-4 py-3 text-left">Drop</th>
                  <th className="px-4 py-3 text-left">Dates</th>
                  <th className="px-4 py-3 text-left">Total</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 10).map((b) => (
                  <tr key={b.booking_id} className="border-t">
                    <td className="px-4 py-3 font-semibold">#{b.booking_id}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold">{b.car_name}</div>
                      <div className="text-xs text-gray-500">{b.car_brand}</div>
                    </td>
                    <td className="px-4 py-3">{b.pickup_location}</td>
                    <td className="px-4 py-3">{b.drop_location}</td>
                    <td className="px-4 py-3">
                      {formatDate(b.start_date)} to {formatDate(b.end_date)}

                      {b.start_time ? (
                        <div className="text-xs text-gray-500">{b.start_time}</div>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">₹{b.total_amount}</td>
                    <td className="px-4 py-3">
                      <select
                        value={String(b.status || "").toUpperCase()}
                        onChange={(e) => updateStatus(b.booking_id, e.target.value)}
                        className="border rounded-lg px-2 py-1 text-sm"
                      >
                        <option value={String(b.status || "").toUpperCase()}>{b.status}</option>
                        {OWNER_STATUS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarRegisterBookings;
