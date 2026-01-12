const bookingService = require("../../services/booking.service");
const { exe } = require("../../config/db");
const PDFDocument = require("pdfkit");
const path = require("path");

exports.createBooking = async (req, res) => {
  try {
    const user_id = getUserId(req);
    if (!user_id) return res.status(401).json({ message: "Unauthorized" });

    const payload = {
      user_id: Number(user_id),
      car_id: Number(req.body.car_id),
      pickup_location: req.body.pickup_location,
      drop_location: req.body.drop_location,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
    };

    const data = await bookingService.createBooking(payload);
    res.status(201).json({ message: "Booking created", ...data });
  } catch (err) {
    console.error("CREATE BOOKING ERROR:", err);
    res.status(400).json({ message: err.message || "Booking failed" });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const user_id = getUserId(req);
    if (!user_id) return res.status(401).json({ message: "Unauthorized" });

    const data = await bookingService.getMyBookings(Number(user_id));
    res.json(data);
  } catch (err) {
    console.error("MY BOOKINGS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const user_id = getUserId(req);
    if (!user_id) return res.status(401).json({ message: "Unauthorized" });

    const booking_id = Number(req.params.id);
    const data = await bookingService.cancelBooking(Number(user_id), booking_id);
    res.json({ message: "Booking cancelled", ...data });
  } catch (err) {
    console.error("CANCEL BOOKING ERROR:", err);
    res.status(400).json({ message: err.message || "Cancel failed" });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const user_id = getUserId(req);
    if (!user_id) return res.status(401).json({ message: "Unauthorized" });

    const booking_id = Number(req.params.id);
    const data = await bookingService.deleteBooking(Number(user_id), booking_id);
    res.json({ message: "Booking deleted", ...data });
  } catch (err) {
    console.error("DELETE BOOKING ERROR:", err);
    res.status(400).json({ message: err.message || "Delete failed" });
  }
};






function getUserId(req) {
  return req.user?.id || req.user?.user_id || req.user_id || null;
}

exports.invoicePdf = async (req, res) => {
  try {
    const bookingId = Number(req.params.id);
    const userId = getUserId(req);

    if (!bookingId) return res.status(400).json({ message: "Invalid booking id" });
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const rows = await exe(
      `
      SELECT 
        b.*,
        c.name AS car_name,
        c.brand AS car_brand
      FROM bookings b
      LEFT JOIN cars c ON c.id = b.car_id
      WHERE b.id = ? AND b.user_id = ?
      LIMIT 1
      `,
      [bookingId, userId]
    );

    if (!rows.length) return res.status(404).json({ message: "Booking not found" });

    const b = rows[0];

    const safe = (v) => (v === null || v === undefined || v === "" ? "-" : String(v));
    const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
    const niceDate = (d) => {
      if (!d) return "-";
      const dt = new Date(d);
      if (Number.isNaN(dt.getTime())) return String(d);
      return dt.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "2-digit" });
    };

    // ✅ Build PDF into memory first (prevents corrupted/half PDFs)
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    // ✅ Optional: use a Unicode font to avoid PDFKit crash on emojis/Indian chars
    // Put font file here: backend/public/fonts/DejaVuSans.ttf
    const fontPath = path.join(process.cwd(), "public", "fonts", "DejaVuSans.ttf");
    try {
      doc.registerFont("u", fontPath);
      doc.font("u");
    } catch (_) {
      // fallback to default font
    }

    const chunks = [];
    doc.on("data", (c) => chunks.push(c));

    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="invoice-booking-${bookingId}.pdf"`
      );
      res.setHeader("Content-Length", pdfBuffer.length);

      return res.status(200).send(pdfBuffer);
    });

    doc.on("error", (e) => {
      console.error("PDFKit error:", e);
      if (!res.headersSent) return res.status(500).json({ message: "PDF generation failed" });
    });

    // ===== SIMPLE CLEAN DESIGN =====
    doc.fontSize(18).fillColor("#111827").text("WorknAI");
    doc.fontSize(10).fillColor("#6B7280").text("Booking Invoice");
    doc.moveDown(0.8);

    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#E5E7EB").stroke();
    doc.moveDown(1);

    doc.fontSize(10).fillColor("#111827").text(
      `Invoice #: INV-${String(bookingId).padStart(5, "0")}`,
      { align: "right" }
    );
    doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, { align: "right" });
    doc.moveDown(1);

    doc.fontSize(12).fillColor("#111827").text("Booking Details");
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor("#374151");
    doc.text(`Booking ID: ${safe(b.id)}`);
    doc.text(`User ID: ${safe(b.user_id)}`);
    doc.text(`Car: ${safe(`${b.car_brand || ""} ${b.car_name || ""}`.trim()) || `Car ID: ${safe(b.car_id)}`}`);
    doc.text(`Status: ${safe(b.status || "CONFIRMED")}`);
    doc.moveDown(0.8);

    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#E5E7EB").stroke();
    doc.moveDown(1);

    doc.fontSize(12).fillColor("#111827").text("Trip");
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor("#374151");
    doc.text(`Pickup: ${safe(b.pickup_location)}`);
    doc.text(`Drop: ${safe(b.drop_location)}`);
    doc.text(`Start Date: ${niceDate(b.start_date)}`);
    doc.text(`End Date: ${niceDate(b.end_date)}`);
    doc.moveDown(0.8);

    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#E5E7EB").stroke();
    doc.moveDown(1);

    doc.fontSize(12).fillColor("#111827").text("Payment");
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor("#374151");
    doc.text(`Booking Total: ${formatINR(b.total_amount)}`);
    doc.moveDown(0.6);
    doc.fontSize(12).fillColor("#111827").text(`Total Payable: ${formatINR(b.total_amount)}`, {
      align: "right",
    });

    doc.moveDown(2);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#E5E7EB").stroke();
    doc.moveDown(0.7);
    doc.fontSize(9).fillColor("#6B7280").text(
      "This invoice is generated electronically and is valid without signature.",
      { align: "center" }
    );

    doc.end();
  } catch (err) {
    console.error("invoicePdf error:", err);
    return res.status(500).json({ message: "Failed to generate invoice" });
  }
};
