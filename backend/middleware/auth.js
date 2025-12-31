const jwt = require("jsonwebtoken");

const JWT_SECRET = "worknai"; // same secret used during login

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader)
      return res.status(401).json({ message: "Login required" });

    const token = authHeader.split(" ")[1];

    if (!token)
      return res.status(401).json({ message: "Token missing" });

    const decoded = jwt.verify(token, JWT_SECRET);

    // decoded = { id, email, iat, exp }
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = auth;

