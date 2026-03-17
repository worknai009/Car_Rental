const { exe } = require("../../config/db");

exports.getUsers = async (req, res) => {
  const users = await exe("SELECT id,name,email,phone,created_at FROM users");
  res.json(users);
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const result = await exe("DELETE FROM users WHERE id=?", [id]);

  if (!result.affectedRows)
    return res.status(404).json({ message: "User not found" });

  res.json({ message: "User deleted successfully" });
};
