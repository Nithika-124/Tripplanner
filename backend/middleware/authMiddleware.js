const jwt = require("jsonwebtoken");

/**
 * Middleware function to protect API routes.
 * Verifies the presence and validity of a JWT in the Authorization header.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Ensure authorization header is present and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // Extract token from header string "Bearer <token>"
    const token = authHeader.split(" ")[1];
    
    // Verify token validity using secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user ID from payload to the request object
    req.user = {
      id: decoded.id,
    };

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = protect;