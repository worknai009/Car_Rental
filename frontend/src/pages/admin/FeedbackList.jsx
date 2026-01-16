import React, { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:1000";

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const token = localStorage.getItem("adminToken");

  const fetchFeedbacks = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`${API_BASE}/admin/feedback`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch feedbacks");
      }

      // supports: { feedbacks: [...] } OR direct array
      const list = Array.isArray(data) ? data : data?.feedbacks || data?.data || [];
      setFeedbacks(list);
    } catch (e) {
      setErr(e.message || "Something went wrong");
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return feedbacks;

    return feedbacks.filter((f) => {
      const text =
        [
          f.id,
          f.user_id,
          f.booking_id,
          f.car_id,
          f.message,
          f.rating,
          f.created_at,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase() || "";

      return text.includes(s);
    });
  }, [feedbacks, q]);

  const handleDelete = async (id) => {
    if (!id) return;
    const ok = window.confirm("Are you sure you want to delete this feedback?");
    if (!ok) return;

    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE}/admin/feedback/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || "Failed to delete feedback");
      }

      setFeedbacks((prev) => prev.filter((x) => x.id !== id));
      alert("✅ Feedback deleted");
    } catch (e) {
      alert(e.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Feedback List</h1>
          <p className="text-sm text-gray-500">View and manage feedbacks</p>
        </div>

        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search id/user/car/message..."
            className="w-full md:w-80 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-white"
          />
          <button
            onClick={fetchFeedbacks}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-bold shadow"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="mt-5 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 text-gray-600">Loading feedbacks...</div>
        ) : err ? (
          <div className="p-6 text-red-700 bg-red-50 border-t border-red-200">
            {err}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-gray-600">No feedback found.</div>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left text-gray-600">
                  <th className="px-4 py-3 font-bold">ID</th>
                  <th className="px-4 py-3 font-bold">User ID</th>
                  <th className="px-4 py-3 font-bold">Booking ID</th>
                  <th className="px-4 py-3 font-bold">Car ID</th>
                  <th className="px-4 py-3 font-bold">Message</th>
                  <th className="px-4 py-3 font-bold">Rating</th>
                  <th className="px-4 py-3 font-bold">Date</th>
                  <th className="px-4 py-3 font-bold text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((f) => {
                  const created = f.created_at || f.createdAt || f.date || "";

                  return (
                    <tr key={f.id} className="border-b border-gray-100">
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {f.id}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{f.user_id}</td>
                      <td className="px-4 py-3 text-gray-700">{f.booking_id}</td>
                      <td className="px-4 py-3 text-gray-700">{f.car_id}</td>
                      <td className="px-4 py-3 text-gray-700 max-w-[520px]">
                        <div className="line-clamp-2">{f.message || "-"}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{f.rating ?? "-"}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {created ? new Date(created).toLocaleString() : "-"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDelete(f.id)}
                          disabled={deletingId === f.id}
                          className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 disabled:opacity-60"
                        >
                          {deletingId === f.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackList;
