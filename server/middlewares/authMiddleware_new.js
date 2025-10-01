import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to verify JWT token
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Invalid or inactive user" });
    }

    // Attach permissions from token or user document
    req.user = {
      ...user.toObject(),
      permissions: decoded.permissions || user.permissions
    };

    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

// Middleware to check if user has required role
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
};

// Combined middleware for protected routes
export const requireAuth = [authenticateToken];

// Admin only routes
export const requireAdmin = [authenticateToken, authorizeRoles("admin")];

// Manager and Admin routes
export const requireManager = [authenticateToken, authorizeRoles("admin", "manager")];

// Cashier routes (cashier and above)
export const requireCashier = [authenticateToken, authorizeRoles("admin", "manager", "cashier")];
