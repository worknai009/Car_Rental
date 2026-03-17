const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) return res.status(401).json({ message: "Token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // optional role check
    if (decoded.role !== "CAR_REGISTER") {
      return res.status(403).json({ message: "Forbidden: invalid role" });
    }

    req.user = decoded; // {id,email,role}
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
