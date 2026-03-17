import React, { useEffect, useMemo, useState } from "react";
import adminApi from "../../utils/adminApi";
import {
  CheckCircle2,
  XCircle,
  RefreshCcw,
  MessageSquareText,
  Calendar,
  Car,
  User,
  ClipboardList,
  X,
} from "lucide-react";

const statusBadge = (s) => {
  const base = "px-3 py-1 rounded-full text-xs font-bold";
  if (s === "APPROVED") return `${base} bg-green-100 text-green-700`;
  if (s === "REJECTED") return `${base} bg-red-100 text-red-700`;
  return `${base} bg-yellow-100 text-yellow-700`;
};

const CancelRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal state
  const [openNote, setOpenNote] = useState(false);
  const [actionType, setActionType] = useState("APPROVE"); // APPROVE | REJECT
  const [selected, setSelected] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [saving, setSaving] = useState(false);

 const normalizeRows = (payload) => {
  // Common shapes:
  // 1) Array -> [...]
  // 2) mysql2 -> [rows, fields]
  // 3) wrapper -> { rows: [...] } or { data: [...] }
  if (Array.isArray(payload)) {
    if (Array.isArray(payload[0])) return payload[0]; // [rows, fields]
    return payload; // rows array
  }
  if (Array.isArray(payload?.rows)) return payload.rows;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.result)) return payload.result;
  return [];
};

const fetchRequests = async () => {
  try {
    setLoading(true);
    const res = await adminApi.get("/admin/cancel-requests");
    const list = normalizeRows(res.data);
    setRequests(list);
  } catch (err) {
    console.error("Fetch cancel requests error:", err);
    setRequests([]);
    alert(err?.response?.data?.message || "Failed to load cancel requests");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchRequests();
  }, []);

  const pendingCount = useMemo(
    () => requests.filter((r) => r.status === "PENDING").length,
    [requests]
  );

  const openActionModal = (reqRow, type) => {
    setSelected(reqRow);
    setActionType(type);
    setAdminNote("");
    setOpenNote(true);
  };

  const closeModal = () => {
    setOpenNote(false);
    setSelected(null);
    setAdminNote("");
    setSaving(false);
  };

  const submitAction = async () => {
    if (!selected?.id) return;
    try {
      setSaving(true);

      if (actionType === "APPROVE") {
        await adminApi.put(`/admin/cancel-requests/${selected.id}/approve`, {
          admin_note: adminNote,
        });
        alert("Approved ✅");
      } else {
        await adminApi.put(`/admin/cancel-requests/${selected.id}/reject`, {
          admin_note: adminNote,
        });
        alert("Rejected ✅");
      }

      closeModal();
      fetchRequests();
    } catch (err) {
      console.error("Update request error:", err);
      alert(err?.response?.data?.message || "Action failed");
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-cyan-600" />
            Cancel Requests
          </h1>
          <p className="text-gray-600 mt-1">
            Pending: <span className="font-bold">{pendingCount}</span>
          </p>
        </div>

        <button
          onClick={fetchRequests}
          className="px-4 py-2 rounded-xl bg-gray-900 text-white font-bold flex items-center gap-2"
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white rounded-2xl p-6 shadow">Loading...</div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 shadow text-gray-600">
          No cancel requests found.
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => {
            const created = r.created_at ? new Date(r.created_at).toLocaleString() : "-";
            const reviewed = r.reviewed_at ? new Date(r.reviewed_at).toLocaleString() : "-";

            const isPending = r.status === "PENDING";

            return (
              <div key={r.id} className="bg-white rounded-2xl shadow border p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Left info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="text-lg font-black text-gray-900">
                        Request #{r.id}
                      </div>
                      <span className={statusBadge(r.status)}>{r.status}</span>
                      <span className="text-sm text-gray-500">
                        Booking ID: <span className="font-bold">{r.booking_id}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold">
                          {r.car_name ? `${r.car_brand || ""} ${r.car_name}` : "Car"}
                        </span>
                        <span className="text-gray-500">(Car ID: {r.car_id || "-"})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span>User ID: <span className="font-bold">{r.user_id}</span></span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>Created: {created}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>Reviewed: {reviewed}</span>
                      </div>
                    </div>

                    {/* Trip */}
                    <div className="text-sm text-gray-700">
                      <span className="font-bold">Trip:</span>{" "}
                      {r.pickup_location || "-"} → {r.drop_location || "-"}{" "}
                      <span className="text-gray-400">|</span>{" "}
                      {r.start_date || "-"} to {r.end_date || "-"}
                    </div>

                    {/* Reason & message */}
                    <div className="bg-gray-50 border rounded-xl p-4">
                      <div className="font-bold text-gray-900 mb-1">
                        Reason: <span className="text-gray-700">{r.reason}</span>
                      </div>
                      {r.message ? (
                        <div className="flex items-start gap-2 text-gray-700 text-sm">
                          <MessageSquareText className="w-4 h-4 mt-0.5 text-gray-500" />
                          <p className="leading-relaxed">{r.message}</p>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">No message.</div>
                      )}
                    </div>

                    {/* Admin note */}
                    {r.admin_note ? (
                      <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
                        <div className="font-bold text-cyan-900 mb-1">Admin Note</div>
                        <p className="text-sm text-cyan-800">{r.admin_note}</p>
                      </div>
                    ) : null}

                    {/* Booking status */}
                    <div className="text-sm text-gray-600">
                      Booking Status:{" "}
                      <span className="font-bold text-gray-900">
                        {r.booking_status || "-"}
                      </span>
                      {typeof r.total_amount !== "undefined" ? (
                        <>
                          {" "}
                          <span className="text-gray-400">|</span> Total:{" "}
                          <span className="font-bold text-gray-900">
                            ₹{Number(r.total_amount || 0).toLocaleString()}
                          </span>
                        </>
                      ) : null}
                    </div>
                  </div>

                  {/* Right actions */}
                  <div className="flex flex-col gap-2 min-w-[220px]">
                    <button
                      disabled={!isPending}
                      onClick={() => openActionModal(r, "APPROVE")}
                      className={`px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 ${
                        isPending
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve
                    </button>

                    <button
                      disabled={!isPending}
                      onClick={() => openActionModal(r, "REJECT")}
                      className={`px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 ${
                        isPending
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ✅ Modal for admin note */}
      {openNote && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900">
                {actionType === "APPROVE" ? "Approve" : "Reject"} Request #{selected.id}
              </h2>

              <button
                onClick={closeModal}
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="text-sm text-gray-700">
                Booking ID: <span className="font-bold">{selected.booking_id}</span>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Admin Note (optional)
                </label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={4}
                  placeholder="Write note for user..."
                  className={`w-full px-4 py-3 rounded-xl border-2 bg-gray-50 focus:bg-white outline-none resize-none ${
                    actionType === "APPROVE"
                      ? "border-gray-200 focus:border-green-600"
                      : "border-gray-200 focus:border-red-600"
                  }`}
                />
              </div>

              <button
                onClick={submitAction}
                disabled={saving}
                className={`w-full py-4 rounded-2xl text-white font-black shadow-lg disabled:opacity-60 ${
                  actionType === "APPROVE"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
                type="button"
              >
                {saving
                  ? "Saving..."
                  : actionType === "APPROVE"
                  ? "Approve Request"
                  : "Reject Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CancelRequests;
