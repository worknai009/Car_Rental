const { exe } = require("../../config/db");

exports.getCategories = async (req, res) => {
  const data = await exe(
    "SELECT id,name FROM categories WHERE is_active=1"
  );
  res.json(data);
};
