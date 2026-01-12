const { exe } = require("../../config/db");

exports.createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await exe(
      "INSERT INTO contact (name,email,subject,message) VALUES (?,?,?,?)",
      [name, email, subject, message]
    );

    return res.json({ message: "Message sent successfully" });
  } catch (err) {
    console.error("CREATE CONTACT ERROR:", err);
    return res.status(500).json({ message: "Failed to send message" });
  }
};
