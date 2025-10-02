import express from "express";
import {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  exportCustomersReport,
} from "../controllers/customerController.js";
import { requireAuth } from "../middlewares/authMiddleware_new.js";
import { requirePermission, PERMISSIONS } from "../middlewares/permissionsMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, requirePermission(PERMISSIONS.VIEW), getCustomers);
router.get("/export", requireAuth, requirePermission(PERMISSIONS.VIEW), exportCustomersReport);
router.get("/:id", requireAuth, requirePermission(PERMISSIONS.READ), getCustomer);
router.post("/", requireAuth, requirePermission(PERMISSIONS.CREATE), createCustomer);
router.put("/:id", requireAuth, requirePermission(PERMISSIONS.UPDATE), updateCustomer);
router.delete("/:id", requireAuth, requirePermission(PERMISSIONS.DELETE), deleteCustomer);

export default router;
