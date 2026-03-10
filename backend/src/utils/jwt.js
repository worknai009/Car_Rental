const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("⚠️  JWT_SECRET is not set in .env — tokens will be insecure!");
}
const JWT_EXPIRE = process.env.JWT_EXPIRE || "1d";

/**
 * Sign a JWT token
 * @param {Object} payload - e.g., { id: 1, role: 'user' }
 * @returns {string} token
 */
exports.signToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

/**
 * Verify a JWT token
 * @param {string} token
 * @returns {Object} decoded payload
 * @throws {Error} if invalid or expired
 */
exports.verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

/**
 * Express middleware to protect routes
 * Adds `req.user` or `req.admin` based on role
 */
exports.authMiddleware = (role = "user") => (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Authorization required" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token missing" });

  try {
    const decoded = exports.verifyToken(token);

    // Check role
    if (role && decoded.role !== role) {
      return res.status(403).json({ message: "Forbidden: incorrect role" });
    }

    req.user = decoded; // for 'user' role
    if (role === "admin") req.admin = decoded; // for 'admin' role
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
