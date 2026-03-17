const { exe } = require("../../config/db");
const bcrypt = require("bcryptjs");
const jwtUtils = require("../../utils/jwt");

// ===============================
// ADMIN REGISTER
// ===============================
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
  }

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

    const payload = { id: result.insertId, name, email, role: "admin" };
    return jwtUtils.sendTokenResponse(payload, 201, res);
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

    const payload = { id: admin.id, name: admin.name, email: admin.email, role: admin.role };
    return jwtUtils.sendTokenResponse(payload, 200, res);
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);
    return res.status(500).json({ success: false, message: "Admin login failed" });
  }
};
exports.logout = (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ success: true, message: "Admin logged out successfully" });
};
