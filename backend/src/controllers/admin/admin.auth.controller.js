// admin.auth.controller.js
const { exe } = require("../../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ===============================
// ADMIN REGISTER
// ===============================
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await exe("SELECT id FROM admins WHERE email = ?", [email]);

    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await exe(
      "INSERT INTO admins (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, "admin"]
    );

    const token = jwt.sign(
      { id: result.insertId, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      token,
      admin: { id: result.insertId, name, email, role: "admin" },
    });
  } catch (error) {
    console.error("ADMIN REGISTER ERROR:", error);
    return res.status(500).json({ success: false, message: "Admin registration failed" });
  }
};

// ===============================
// ADMIN LOGIN
// ===============================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admins = await exe("SELECT * FROM admins WHERE email = ?", [email]);

    if (admins.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const admin = admins[0];

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);
    return res.status(500).json({ success: false, message: "Admin login failed" });
  }
};
