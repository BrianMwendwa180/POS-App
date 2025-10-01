import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile
} from "../controllers/authController_new.js";
import { requireAuth, requireAdmin } from "../middlewares/authMiddleware_new.js";
import {
  validateUserRegistration,
  validateLogin
} from "../middlewares/validationMiddleware.js";

const router = express.Router();

// Public routes (temporarily allow registration for testing)
router.post("/register", validateUserRegistration, register);
router.post("/login", validateLogin, login);

// Protected routes
router.get("/profile", requireAuth, getProfile);
router.put("/profile", requireAuth, updateProfile);

export default router;
