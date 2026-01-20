const { exe } = require("../../config/db");

const ALLOWED_STATUS = ["ACTIVE", "INACTIVE", "BLOCKED", "PENDING"];

// ✅ GET /admin/car-register-users?status=&q=
exports.listCarRegisterUsers = async (req, res) => {
  try {
    const { status, q } = req.query;

    let sql = `
      SELECT
        id, name, phone, email, role, status, created_at, updated_at
      FROM car_register_users
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      sql += ` AND UPPER(status) = ?`;
      params.push(String(status).trim().toUpperCase());
    }

    if (q) {
      sql += ` AND (
        name LIKE ? OR phone LIKE ? OR email LIKE ?
      )`;
      const like = `%${q}%`;
      params.push(like, like, like);
    }

    sql += ` ORDER BY id DESC`;

    const rows = await exe(sql, params);
    return res.json(Array.isArray(rows) ? rows : []);
  } catch (err) {
    console.error("listCarRegisterUsers error:", err);
    return res.status(500).json({ message: "Failed to load car register users" });
  }
};

// ✅ GET /admin/car-register-users/:id
exports.getCarRegisterUserById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid id" });

    const rows = await exe(
      `SELECT id, name, phone, email, role, status, created_at, updated_at
       FROM car_register_users
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error("getCarRegisterUserById error:", err);
    return res.status(500).json({ message: "Failed to load user" });
  }
};

// ✅ PATCH /admin/car-register-users/:id/status
// body: { status: "ACTIVE" }
exports.updateCarRegisterUserStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid id" });

    let { status } = req.body;
    status = String(status || "").trim().toUpperCase();

    if (!status) return res.status(400).json({ message: "Status is required" });

    // If you want to allow any value, remove this check.
    if (!ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed: ${ALLOWED_STATUS.join(", ")}`
      });
    }

    const result = await exe(
      `UPDATE car_register_users SET status=?, updated_at=NOW() WHERE id=?`,
      [status, id]
    );

    const affected = result?.affectedRows ?? 0;
    if (!affected) return res.status(404).json({ message: "User not found" });

    return res.json({ message: "Status updated ✅", id, status });
  } catch (err) {
    console.error("updateCarRegisterUserStatus error:", err);
    return res.status(500).json({ message: "Failed to update status" });
  }
};
