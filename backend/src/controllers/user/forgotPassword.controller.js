const { exe } = require("../../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const FRONTEND_URL =
  process.env.FRONTEND_URL ||
  process.env.CLIENT_URL ||
  "http://localhost:5174"; // ✅ keep same port as your frontend

const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.forgotPassword = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!email) return res.status(400).json({ message: "Email is required" });

    const users = await exe("SELECT id, email FROM users WHERE email=? LIMIT 1", [email]);

    // ✅ don’t reveal account existence
    if (!users || users.length === 0) {
      return res.json({ message: "If your email exists, reset link has been sent." });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET missing in server env" });
    }

    const user = users[0];

    const token = jwt.sign(
      { id: user.id, email: user.email, type: "RESET" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const link = `${FRONTEND_URL}/reset-password?token=${token}`;

    await mailer.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Reset your password",
      html: `
        <div style="font-family:Arial,sans-serif">
          <h2>Password Reset</h2>
          <p>Click the link below to reset your password (valid for 15 minutes):</p>
          <p><a href="${link}">${link}</a></p>
          <p>If you didn't request this, ignore this email.</p>
        </div>
      `,
    });

    return res.json({ message: "If your email exists, reset link has been sent." });
  } catch (err) {
    console.error("forgotPassword error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const token = String(req.body.token || "").trim();
    const password = String(req.body.password || "");

    if (!token) return res.status(400).json({ message: "Token is required" });
    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET missing in server env" });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    if (payload.type !== "RESET") {
      return res.status(400).json({ message: "Invalid token type" });
    }

    const hash = await bcrypt.hash(password, 10);

    // ✅ FIX: your column name is `password`
    const result = await exe(
      "UPDATE users SET password=? WHERE id=?",
      [hash, payload.id]
    );

    const affected = result?.affectedRows ?? 0;
    if (!affected) return res.status(404).json({ message: "User not found" });

    return res.json({ message: "Password reset successful ✅" });
  } catch (err) {
    console.error("resetPassword error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
