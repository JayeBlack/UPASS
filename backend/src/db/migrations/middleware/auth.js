const jwt = require("jsonwebtoken");

/**
 * JWT authentication middleware
 * Extracts and verifies the Bearer token from the Authorization header
 */
const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

/**
 * Role-based authorization middleware
 * @param  {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied — insufficient permissions" });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
