const { exe } = require("../../config/db");
const path = require("path");
const fs = require("fs");

// ✅ Helper to save files
// ✅ Helper to save multiple files
const saveFiles = async (files, subfolder) => {
  if (!files) return "[]";
  const uploadDir = path.join(__dirname, "../../../public/uploads", subfolder);
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  
  const filesArray = Array.isArray(files) ? files : [files];
  const paths = [];

  for (const file of filesArray) {
    const filename = Date.now() + "-" + file.name;
    await file.mv(path.join(uploadDir, filename));
    paths.push(`/uploads/${subfolder}/${filename}`);
  }
  return JSON.stringify(paths);
};

// --- TOUR PACKAGES ---

// GET (Admin) List all
exports.getAllTours = async (req, res) => {
  try {
    const rows = await exe("SELECT * FROM tours_packages ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch tours" });
  }
};// GET (Admin) Single Tour Details
exports.getTourDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await exe("SELECT * FROM tours_packages WHERE id = ?", [id]);
    if (tour.length === 0) return res.status(404).json({ message: "Tour not found" });
    res.json(tour[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch tour details" });
  }
};

// POST Add Tour
exports.addTour = async (req, res) => {
  try {
    const tourImages = await saveFiles(req.files?.images, "tours");
    const { title, description, duration, price, itinerary, inclusions, exclusions, tour_date, tour_time, routes } = req.body;

    await exe(
      `INSERT INTO tours_packages (title, description, duration, price, images, itinerary, inclusions, exclusions, tour_date, tour_time, routes, status, created_by_role)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'APPROVED', 'ADMIN')`,
      [title, description, duration, price, tourImages, itinerary, inclusions, exclusions, tour_date, tour_time, routes]
    );

    res.json({ message: "Tour package added successfully ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add tour" });
  }
};

// PUT Update Tour (Partial or Full)
exports.updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Build dynamic SQL
    const fields = [];
    const params = [];

    // Handle normal fields
    const possibleFields = [
      'title', 'description', 'duration', 'price', 'itinerary', 
      'inclusions', 'exclusions', 'is_active', 'tour_date', 
      'tour_time', 'routes', 'status'
    ];

    possibleFields.forEach(field => {
      if (updates[field] !== undefined) {
        fields.push(`${field} = ?`);
        params.push(updates[field]);
      }
    });

    // Handle images separately
    if (req.files?.images) {
      const tourImages = await saveFiles(req.files.images, "tours");
      fields.push(`images = ?`);
      params.push(tourImages);
    }

    if (fields.length === 0) {
      return res.json({ message: "No fields to update" });
    }

    params.push(id);
    const sql = `UPDATE tours_packages SET ${fields.join(", ")} WHERE id = ?`;

    await exe(sql, params);
    res.json({ message: "Tour package updated ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update tour" });
  }
};

// DELETE Tour
exports.deleteTour = async (req, res) => {
  try {
    const { id } = req.params;
    await exe("DELETE FROM tours_packages WHERE id=?", [id]);
    res.json({ message: "Tour package deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete tour" });
  }
};

// --- TOUR BOOKINGS ---

// GET All Bookings (Admin)
exports.getAllTourBookings = async (req, res) => {
  try {
    const rows = await exe(`
      SELECT b.*, u.name as user_name, u.email as user_email, t.title as tour_title
      FROM tour_bookings b
      JOIN users u ON b.user_id = u.id
      JOIN tours_packages t ON b.tour_id = t.id
      ORDER BY b.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch tour bookings" });
  }
};

// PATCH Update status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await exe("UPDATE tour_bookings SET status=? WHERE id=?", [status, id]);
    res.json({ message: "Booking status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update booking status" });
  }
};
