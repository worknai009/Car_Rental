import React, { useEffect, useState } from "react";
import userApi from "../utils/userApi";
import { XCircle, FileText, X, Star } from "lucide-react";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ----------------------------
  // Cancel modal state
  // ----------------------------
  const [openCancel, setOpenCancel] = useState(false);
  const [selected, setSelected] = useState(null);
  const [reason, setReason] = useState("Change of Plan");
  const [cancelMessage, setCancelMessage] = useState("");
  const [submittingCancel, setSubmittingCancel] = useState(false);

  // ----------------------------
  // Feedback modal state
  // ----------------------------
  const [openFeedback, setOpenFeedback] = useState(false);
  const [fbBooking, setFbBooking] = useState(null);
  const [fbRating, setFbRating] = useState(5);
  const [fbMessage, setFbMessage] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await userApi.get("/bookings/mybookings");
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch bookings error:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ✅ open cancel request form
  const openCancelForm = (booking) => {
    setSelected(booking);
    setReason("Change of Plan");
    setCancelMessage("");
    setOpenCancel(true);
  };

  // ✅ submit cancel request to admin
  const submitCancelRequest = async () => {
    if (!selected?.id) return;

    try {
      setSubmittingCancel(true);
      await userApi.post(`/bookings/cancel-request/${selected.id}`, {
        reason,
        message: cancelMessage,
      });
      alert("Cancel request sent to admin ✅");
      setOpenCancel(false);
      setSelected(null);
      fetchBookings();
    } catch (err) {
      alert(err?.response?.data?.message || "Cancel request failed");
    } finally {
      setSubmittingCancel(false);
    }
  };

  // ✅ Submit Feedback (ONLY booking_id + rating + message)
  const submitFeedback = async () => {
    if (!fbBooking?.id) return;
    if (!fbRating || fbRating < 1 || fbRating > 5) {
      return alert("Please select rating (1 to 5)");
    }

    try {
      setSubmittingFeedback(true);

      await userApi.post("/feedback", {
        booking_id: Number(fbBooking.id),
        rating: Number(fbRating),
        message: fbMessage,
      });

      alert("Feedback submitted ✅ Thank you!");
      setOpenFeedback(false);
      setFbBooking(null);
      setFbRating(5);
      setFbMessage("");
    } catch (err) {
      console.error("Feedback error:", err);
      alert(err?.response?.data?.message || "Feedback failed");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  // ✅ Download invoice PDF
  const downloadInvoice = async (id) => {
    try {
      const res = await userApi.get(`/bookings/invoice/${id}`, {
        responseType: "arraybuffer",
      });

      const ct = (res.headers?.["content-type"] || "").toLowerCase();
      if (!ct.includes("application/pdf")) {
        const text = new TextDecoder().decode(res.data);
        alert(text || "Invoice response is not a PDF (check backend)");
        return;
      }

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-booking-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Invoice download error:", err);
      alert(err?.response?.data?.message || "Invoice download failed");
    }
  };

  // ✅ robust car image getter (supports different API shapes)
  const getCarImage = (b) =>
    b?.car_image ||
    b?.carImage ||
    b?.car?.image ||
    b?.car?.image_url ||
    (Array.isArray(b?.car?.images) ? b.car.images[0] : null) ||
    b?.image_url ||
    null;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 mb-6">My Bookings</h1>

        {loading ? (
          <div className="bg-white p-6 rounded-2xl shadow">Loading...</div>
        ) : bookings.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl shadow text-gray-600">
            No bookings found.
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => {
              const st = String(b.status || "").toUpperCase();
              const img = getCarImage(b);

              return (
                <div key={b.id} className="bg-white p-6 rounded-2xl shadow border">
                  <div className="flex items-start justify-between gap-4">
                    {/* ✅ Car Image */}
                    <div className="flex items-start gap-4">


                      {/* Booking Details */}
                      <div>
                        <div className="text-lg font-bold text-gray-900">
                          Booking #{b.id} • Car ID: {b.car_id}
                        </div>

                        <div className="text-sm text-gray-600 mt-1">
                          {b.pickup_location} → {b.drop_location}
                        </div>

                        {/* ✅ Date slice(0,10) */}
                        <div className="text-sm text-gray-600">
                          {String(b.start_date || "").slice(0, 10)} to{" "}
                          {String(b.end_date || "").slice(0, 10)}
                        </div>

                        <div className="text-sm font-semibold text-gray-900 mt-2">
                          Total: ₹{b.total_amount}
                        </div>

                        <div className="text-xs mt-1">
                          Status: <span className="font-bold">{st || "BOOKED"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => downloadInvoice(b.id)}
                        className="px-4 py-2 rounded-xl bg-gray-900 text-white font-bold flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        Invoice PDF
                      </button>

                      {/* ✅ Hide Cancel button when COMPLETED or CANCELLED */}
                      {st !== "COMPLETED" && st !== "CANCELLED" && (
                        <button
                          onClick={() => openCancelForm(b)}
                          disabled={st === "CANCEL_REQUESTED"}
                          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 ${st === "CANCEL_REQUESTED"
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-orange-100 text-orange-700"
                            }`}
                        >
                          <XCircle className="w-4 h-4" />
                          {st === "CANCEL_REQUESTED" ? "Requested" : "Cancel"}
                        </button>
                      )}


                      {/* ✅ Complete Ride button removed */}

                      {/* Optional: if already completed, allow feedback */}
                      {st === "COMPLETED" && (
                        <button
                          onClick={() => {
                            setFbBooking(b);
                            setFbRating(5);
                            setFbMessage("");
                            setOpenFeedback(true);
                          }}
                          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold"
                        >
                          Give Feedback
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ✅ Cancel Request Modal */}
      {openCancel && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900">
                Request Cancellation (Booking #{selected.id})
              </h2>
              <button
                onClick={() => setOpenCancel(false)}
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Reason
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-orange-500 outline-none"
                >
                  <option>Change of Plan</option>
                  <option>Found better price</option>
                  <option>Vehicle not needed</option>
                  <option>Pickup location issue</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Message to Admin (optional)
                </label>
                <textarea
                  value={cancelMessage}
                  onChange={(e) => setCancelMessage(e.target.value)}
                  rows={4}
                  placeholder="Write your cancellation request message..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-orange-500 outline-none resize-none"
                />
              </div>

              <button
                onClick={submitCancelRequest}
                disabled={submittingCancel}
                className="w-full py-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black shadow-lg disabled:opacity-60"
              >
                {submittingCancel ? "Sending..." : "Send Cancel Request"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Feedback Modal */}
      {openFeedback && fbBooking && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900">
                Feedback (Booking #{fbBooking.id})
              </h2>
              <button
                onClick={() => setOpenFeedback(false)}
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setFbRating(n)}
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center ${fbRating >= n
                          ? "bg-yellow-100 border-yellow-300"
                          : "bg-gray-50 border-gray-200"
                        }`}
                    >
                      <Star
                        className={`w-5 h-5 ${fbRating >= n ? "text-yellow-500 fill-current" : "text-gray-400"
                          }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 font-bold text-gray-900">{fbRating}/5</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={fbMessage}
                  onChange={(e) => setFbMessage(e.target.value)}
                  rows={4}
                  placeholder="Write your feedback..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-cyan-500 outline-none resize-none"
                />
              </div>

              <button
                onClick={submitFeedback}
                disabled={submittingFeedback}
                className="w-full py-4 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-black shadow-lg disabled:opacity-60"
              >
                {submittingFeedback ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
