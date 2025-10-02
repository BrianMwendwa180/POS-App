import express from "express";
import {
  createSale,
  getSales,
  getSale,
  getSalesSummary,
  exportSalesReport
} from "../controllers/saleController.js";
import { requireAuth } from "../middlewares/authMiddleware_new.js";
import { requirePermission, PERMISSIONS } from "../middlewares/permissionsMiddleware.js";
import { validateSale } from "../middlewares/validationMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, requirePermission(PERMISSIONS.VIEW), getSales);
router.get("/summary", requireAuth, requirePermission(PERMISSIONS.VIEW), getSalesSummary);
router.get("/export", requireAuth, requirePermission(PERMISSIONS.VIEW), exportSalesReport);
router.get("/:id", requireAuth, requirePermission(PERMISSIONS.READ), getSale);
router.post("/", requireAuth, requirePermission(PERMISSIONS.CREATE), validateSale, createSale);

export default router;
