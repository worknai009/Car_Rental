const bcrypt = require("bcryptjs");
const { exe } = require("../../config/db"); 
const jwtUtils = require("../../utils/jwt");

// POST /api/car-register/auth/register
exports.register = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, password are required" });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    const existing = await exe(
      "SELECT id FROM car_register_users WHERE email = ? LIMIT 1",
      [cleanEmail]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const password_hash = await bcrypt.hash(String(password), 10);

    const result = await exe(
      `INSERT INTO car_register_users (name, phone, email, password_hash, role, status)
       VALUES (?, ?, ?, ?, 'CAR_REGISTER', 'ACTIVE')`,
      [String(name).trim(), phone ? String(phone).trim() : null, cleanEmail, password_hash]
    );

    const user = {
      id: result.insertId,
      name: String(name).trim(),
      phone: phone ? String(phone).trim() : null,
      email: cleanEmail,
      role: "CAR_REGISTER",
      status: "ACTIVE",
    };

    // ✅ IMPORTANT: Don't send token on register
    return res.status(201).json({
      message: "Registered successfully. Please login.",
      user,
    });
  } catch (err) {
    console.error("car-register register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// POST /api/car-register/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    const rows = await exe(
      `SELECT id, name, phone, email, password_hash, role, status,created_at, updated_at
       FROM car_register_users
       WHERE email = ?
       LIMIT 1`,
      [cleanEmail]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const userRow = rows[0];

    if (userRow.status !== "ACTIVE") {
      return res.status(403).json({ message: "Account is blocked" });
    }

    const ok = await bcrypt.compare(String(password), userRow.password_hash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const payload = {
      id: userRow.id,
      name: userRow.name,
      phone: userRow.phone,
      email: userRow.email,
      role: userRow.role,
      status: userRow.status,
    };

    return jwtUtils.sendTokenResponse(payload, 200, res);
  } catch (err) {
    console.error("car-register login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/car-register/auth/me
exports.me = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const rows = await exe(
      `SELECT id, name, phone, email, role, status, created_at, updated_at
       FROM car_register_users
       WHERE id = ?
       LIMIT 1`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user: rows[0] });
  } catch (err) {
    console.error("car-register me error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.logout = (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ success: true, message: "Car owner logged out successfully" });
};
