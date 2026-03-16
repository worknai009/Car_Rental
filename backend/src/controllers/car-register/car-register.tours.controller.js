const { exe } = require("../../config/db");
const path = require("path");
const fs = require("fs");

// Helper to save multiple files
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

// POST Add Tour (Car Register/Vendor)
exports.addTour = async (req, res) => {
  try {
    const tourImages = await saveFiles(req.files?.images, "tours");
    const { title, description, duration, price, itinerary, inclusions, exclusions, tour_date, tour_time, routes } = req.body;
    const vendor_id = req.user.id;

    await exe(
      `INSERT INTO tours_packages (title, description, duration, price, images, itinerary, inclusions, exclusions, tour_date, tour_time, routes, status, created_by, created_by_role)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, 'CAR_REGISTER')`,
      [title, description, duration, price, tourImages, itinerary, inclusions, exclusions, tour_date, tour_time, routes, vendor_id]
    );

    res.json({ message: "Tour package submitted for approval ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add tour" });
  }
};

// GET My Tours
exports.getMyTours = async (req, res) => {
  try {
    const vendor_id = req.user.id;
    const rows = await exe("SELECT * FROM tours_packages WHERE created_by = ? AND created_by_role = 'CAR_REGISTER' ORDER BY created_at DESC", [vendor_id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch your tours" });
  }
};

// GET Single Tour
exports.getTour = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor_id = req.user.id;
    const tour = await exe("SELECT * FROM tours_packages WHERE id = ? AND created_by = ?", [id, vendor_id]);
    if (tour.length === 0) return res.status(404).json({ message: "Tour not found" });
    res.json(tour[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch tour" });
  }
};

// PUT Update Tour (Partial or Full)
exports.updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor_id = req.user.id;
    const updates = req.body;

    // Check if tour exists and belongs to vendor
    const existing = await exe("SELECT id FROM tours_packages WHERE id = ? AND created_by = ?", [id, vendor_id]);
    if (existing.length === 0) return res.status(404).json({ message: "Tour not found" });

    // Build dynamic SQL
    const fields = [];
    const params = [];

    const possibleFields = [
      'title', 'description', 'duration', 'price', 'itinerary', 
      'inclusions', 'exclusions', 'tour_date', 'tour_time', 'routes'
    ];

    possibleFields.forEach(field => {
      if (updates[field] !== undefined) {
        fields.push(`${field} = ?`);
        params.push(updates[field]);
      }
    });

    if (req.files?.images) {
      const tourImages = await saveFiles(req.files.images, "tours");
      fields.push(`images = ?`);
      params.push(tourImages);
    }

    if (fields.length === 0 && !req.files?.images) {
      return res.json({ message: "No fields to update" });
    }

    // Every update from partner resets status to PENDING
    fields.push("status = 'PENDING'");

    params.push(id, vendor_id);
    const sql = `UPDATE tours_packages SET ${fields.join(", ")} WHERE id = ? AND created_by = ?`;

    await exe(sql, params);
    res.json({ message: "Tour updated and resubmitted for approval ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update tour" });
  }
};

// DELETE My Tour (only if pending)
exports.deleteTour = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor_id = req.user.id;
    
    const tour = await exe("SELECT status FROM tours_packages WHERE id = ? AND created_by = ?", [id, vendor_id]);
    if (tour.length === 0) return res.status(404).json({ message: "Tour not found" });
    
    await exe("DELETE FROM tours_packages WHERE id=? AND created_by=?", [id, vendor_id]);
    res.json({ message: "Tour deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete tour" });
  }
};
