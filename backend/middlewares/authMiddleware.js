// ==========================================
// TRINETRA BACKEND - AUTH MIDDLEWARE (Gatekeeper Shield)
// Validates JWT tokens on protected routes
// ==========================================
import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: "TriNetra Gatekeeper: No authentication token provided."
      });
    }

    const token = authHeader.split(' ')[1];

    if (!process.env.JWT_SECRET) {
      console.error("[TriNetra Auth] FATAL: JWT_SECRET not configured.");
      return res.status(500).json({ success: false, message: "Server authentication misconfigured." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      trinetraId: decoded.trinetraId,
      access: decoded.access
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: "Token expired. Please login again." });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: "Invalid token. Access denied." });
    }
    console.error("[TriNetra Auth Middleware Error]:", error);
    return res.status(500).json({ success: false, message: "Authentication check failed." });
  }
};

export default requireAuth;
