import express from "express";
import {
  getInventoryTransactions,
  getInventoryLevels,
  adjustInventory,
  getInventoryAlerts,
  getInventoryValueReport,
  exportInventoryReport
} from "../controllers/inventoryController.js";
import { requireAuth, requireManager } from "../middlewares/authMiddleware_new.js";
import { requirePermission, PERMISSIONS } from "../middlewares/permissionsMiddleware.js";

const router = express.Router();

router.get("/transactions", requireAuth, requirePermission(PERMISSIONS.VIEW), getInventoryTransactions);
router.get("/levels", requireAuth, requirePermission(PERMISSIONS.VIEW), getInventoryLevels);
router.get("/alerts", requireAuth, requirePermission(PERMISSIONS.VIEW), getInventoryAlerts);
router.get("/value-report", requireAuth, requirePermission(PERMISSIONS.VIEW), getInventoryValueReport);
router.get("/export", requireAuth, requirePermission(PERMISSIONS.VIEW), exportInventoryReport);
router.post("/adjust", requireAuth, requirePermission(PERMISSIONS.UPDATE), adjustInventory);

export default router;
