const { exe } = require("../../config/db");

exports.listCancelRequests = async (req, res) => {
  try {
    const result = await exe(`
      SELECT 
        cr.id AS id,
        cr.booking_id,
        cr.user_id,
        cr.reason,
        cr.message,
        cr.status,
        cr.admin_note,
        cr.created_at,
        cr.reviewed_at,
        cr.reviewed_by,

        b.status AS booking_status,
        b.pickup_location,
        b.drop_location,
        b.start_date,
        b.end_date,
        b.total_amount,
        b.car_id,

        c.name AS car_name,
        c.brand AS car_brand
      FROM cancel_requests cr
      LEFT JOIN bookings b ON b.id = cr.booking_id
      LEFT JOIN cars c ON c.id = b.car_id
      ORDER BY cr.id DESC
    `);

    // handle mysql2: [rows, fields] OR wrappers: {rows: []}
    const rows =
      Array.isArray(result) ? (Array.isArray(result[0]) ? result[0] : result) : (result?.rows || []);

    return res.json(rows); // ✅ always array
  } catch (err) {
    console.error("listCancelRequests error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.approveCancelRequest = async (req, res) => {
  try {
    const adminId = req.user?.id;
    const id = Number(req.params.id);
    const { admin_note } = req.body;

    const rows = await exe("SELECT * FROM cancel_requests WHERE id=?", [id]);
    if (!rows.length) return res.status(404).json({ message: "Request not found" });

    const reqRow = rows[0];
    if (reqRow.status !== "PENDING")
      return res.status(400).json({ message: "Request already reviewed" });

    await exe(
      `UPDATE cancel_requests 
       SET status='APPROVED', admin_note=?, reviewed_by=?, reviewed_at=NOW()
       WHERE id=?`,
      [admin_note || "", adminId || null, id]
    );

    // ✅ cancel booking too
    await exe("UPDATE bookings SET status='CANCELLED' WHERE id=?", [reqRow.booking_id]);

    res.json({ message: "Request approved ✅" });
  } catch (err) {
    console.error("approveCancelRequest error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.rejectCancelRequest = async (req, res) => {
  try {
    const adminId = req.user?.id;
    const id = Number(req.params.id);
    const { admin_note } = req.body;

    const rows = await exe("SELECT * FROM cancel_requests WHERE id=?", [id]);
    if (!rows.length) return res.status(404).json({ message: "Request not found" });

    const reqRow = rows[0];
    if (reqRow.status !== "PENDING")
      return res.status(400).json({ message: "Request already reviewed" });

    await exe(
      `UPDATE cancel_requests
       SET status='REJECTED', admin_note=?, reviewed_by=?, reviewed_at=NOW()
       WHERE id=?`,
      [admin_note || "", adminId || null, id]
    );

    // ✅ booking back to CONFIRMED (because cancel rejected)
    await exe("UPDATE bookings SET status='CONFIRMED' WHERE id=?", [reqRow.booking_id]);

    res.json({ message: "Request rejected ✅" });
  } catch (err) {
    console.error("rejectCancelRequest error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
