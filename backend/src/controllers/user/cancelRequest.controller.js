const { exe } = require("../../config/db");

exports.createCancelRequest = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.user_id || req.userId;
    const bookingId = Number(req.params.id);
    const { reason, message } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!bookingId) return res.status(400).json({ message: "Booking id missing" });
    if (!reason) return res.status(400).json({ message: "Reason is required" });

    const rows = await exe("SELECT * FROM bookings WHERE id=? AND user_id=?", [bookingId, userId]);
    if (!rows.length) return res.status(404).json({ message: "Booking not found" });

    const booking = rows[0];
    const status = String(booking.status || "").trim().toUpperCase();

    if (status === "CANCELLED" || status === "CANCELED") {
      return res.status(409).json({ message: "Booking already cancelled" });
    }

    if (status === "CANCEL_REQUESTED") {
      return res.status(409).json({ message: "Cancel request already submitted" });
    }

    const pending = await exe(
      "SELECT id FROM cancel_requests WHERE booking_id=? AND user_id=? AND status='PENDING' LIMIT 1",
      [bookingId, userId]
    );
    if (pending.length) {
      return res.status(409).json({ message: "Cancel request already pending" });
    }

    await exe(
      "INSERT INTO cancel_requests (booking_id, user_id, reason, message, status) VALUES (?,?,?,?, 'PENDING')",
      [bookingId, userId, reason, message || ""]
    );

    await exe("UPDATE bookings SET status='CANCEL_REQUESTED' WHERE id=?", [bookingId]);

    res.json({ message: "Cancel request sent to admin ✅" });
  } catch (err) {
    console.error("createCancelRequest error:", err);
    res.status(500).json({ message: "Server error", error: err?.message });
  }
};
