const { exe } = require("../../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// /* ================= REGISTER ================= */
// exports.register = async (req, res) => {
//   const { name, email, password } = req.body;

//   const exists = await exe("SELECT id FROM users WHERE email=?", [email]);
//   if (exists.length) {
//     return res.status(400).json({ message: "Email already registered" });
//   }

//   const hash = await bcrypt.hash(password, 10);

//   await exe(
//     "INSERT INTO users (name,email,password,role,created_at) VALUES (?,?,?,?,NOW())",
//     [name, email, hash, "user"]
//   );

//   res.json({ message: "Registration successful" });
// };

// /* ================= LOGIN ================= */
// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   const users = await exe("SELECT * FROM users WHERE email=?", [email]);
//   if (!users.length)
//     return res.status(401).json({ message: "Invalid credentials" });

//   const user = users[0];
//   const match = await bcrypt.compare(password, user.password);
//   if (!match)
//     return res.status(401).json({ message: "Invalid credentials" });

//   const token = jwt.sign(
//     { id: user.id, role: "user" },
//     process.env.JWT_SECRET,
//     { expiresIn: process.env.JWT_EXPIRE }
//   );

//   res.json({
//     message: "Login successful",
//     token,
//     user: { id: user.id, name: user.name, email: user.email },
//   });
// };

/* ================= GET ALL USERS ================= */
exports.getAllUsers = async (req, res) => {
  const users = await exe(
    "SELECT id,name,email,created_at FROM users ORDER BY id DESC"
  );
  res.json(users);
};

/* ================= GET USER BY ID ================= */
exports.getProfile = async (req, res) => {
  const { id } = req.params;

  const data = await exe(
    "SELECT id,name,email,created_at FROM users WHERE id=?",
    [id]
  );

  if (!data.length) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(data[0]);
};

/* ================= UPDATE PROFILE ================= */
exports.updateProfile = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  await exe(
    "UPDATE users SET name=?, email=? WHERE id=?",
    [name, email, id]
  );

  res.json({ message: "Profile updated successfully" });
};
