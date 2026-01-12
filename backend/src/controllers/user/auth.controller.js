const { exe } = require("../../config/db");
const bcrypt = require("bcryptjs");
const jwtUtils = require("../../utils/jwt");
const sendOTP = require("../../utils/email"); // adjust path if needed

/**
 * =====================
 * USER REGISTER
 * =====================
 */
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existing = await exe(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await exe(
      "INSERT INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())",
      [name, email, hashedPassword, "user"]
    );

    res.status(201).json({
      message: "Registration successful",
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

/**
 * =====================
 * USER LOGIN → SEND OTP
 * =====================
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const users = await exe(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (!users.length) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🔐 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await exe(
      "UPDATE users SET otp=?, otp_expiry=? WHERE id=?",
      [otp, otpExpiry, user.id]
    );

    // 📧 Send OTP
    await sendOTP(user.email, otp);

    res.json({
      message: "OTP sent to your email",
      user_id: user.id,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

/**
 * =====================
 * VERIFY OTP → ISSUE TOKEN
 * =====================
 */
exports.verifyOtp = async (req, res) => {
  const { user_id, otp } = req.body;

  if (!user_id || !otp) {
    return res.status(400).json({ message: "OTP required" });
  }

  try {
    const users = await exe(
      "SELECT * FROM users WHERE id = ?",
      [user_id]
    );

    if (!users.length) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = users[0];

    if (user.otp !== Number(otp)) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    if (new Date() > user.otp_expiry) {
      return res.status(401).json({ message: "OTP expired" });
    }

    // clear otp
    await exe(
      "UPDATE users SET otp=NULL, otp_expiry=NULL WHERE id=?",
      [user.id]
    );

    // 🔑 Create JWT
    const token = jwtUtils.signToken({
      id: user.id,
      role: user.role,
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: "OTP verification failed" });
  }
};
