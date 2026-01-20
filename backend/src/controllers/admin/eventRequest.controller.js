const eventRequestService = require("../../services/eventRequest.service");

exports.listRequests = async (req, res) => {
  try {
    const status = req.query.status ? String(req.query.status).toUpperCase() : null;
    const rows = await eventRequestService.listEventRequests({ status });
    return res.json(rows);
  } catch (err) {
    console.error("ADMIN LIST EVENT REQUESTS ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch event requests" });
  }
};

exports.getRequestById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const row = await eventRequestService.getEventRequestById(id);
    if (!row) return res.status(404).json({ message: "Request not found" });
    return res.json(row);
  } catch (err) {
    console.error("ADMIN GET EVENT REQUEST ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch request" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const status = String(req.body.status).toUpperCase();

    const data = await eventRequestService.updateEventRequestStatus(id, status);
    return res.json({ message: "Status updated", ...data });
  } catch (err) {
    console.error("ADMIN UPDATE STATUS ERROR:", err);
    return res.status(400).json({ message: err.message || "Failed to update status" });
  }
};
