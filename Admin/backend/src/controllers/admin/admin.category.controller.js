const { exe } = require("../../config/db");

exports.addCategory = async (req, res) => {
  const { name } = req.body;

  await exe("INSERT INTO categories (name) VALUES (?)", [name]);
  res.json({ message: "Category added successfully" });
};

exports.getCategories = async (req, res) => {
  const data = await exe("SELECT * FROM categories");
  res.json(data);
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  await exe("UPDATE categories SET name=? WHERE id=?", [name, id]);
  res.json({ message: "Category updated successfully" });
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  await exe("DELETE FROM categories WHERE id=?", [id]);
  res.json({ message: "Category deleted successfully" });
};
