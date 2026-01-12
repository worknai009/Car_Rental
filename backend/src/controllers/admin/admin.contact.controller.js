const { exe } = require("../../config/db");

/**
 * GET /admin/contacts
 */
exports.getAllContacts = async (req, res) => {
  try {
    const data = await exe(`SELECT * FROM contact ORDER BY id DESC`);
    res.json(data);
  } catch (err) {
    console.error("GET CONTACTS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch contacts" });
  }
};

/**
 * DELETE /admin/contacts/:id
 */
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    await exe(`DELETE FROM contact WHERE id=?`, [id]);
    res.json({ message: "Contact deleted successfully" });
  } catch (err) {
    console.error("DELETE CONTACT ERROR:", err);
    res.status(500).json({ message: "Failed to delete contact" });
  }
};
