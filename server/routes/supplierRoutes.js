import express from "express";
import {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierReport
} from "../controllers/supplierController.js";
import { requireAuth, requireManager } from "../middlewares/authMiddleware_new.js";
import { requirePermission, PERMISSIONS } from "../middlewares/permissionsMiddleware.js";
import { validateSupplier } from "../middlewares/validationMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, requirePermission(PERMISSIONS.VIEW), getSuppliers);
router.get("/report", requireAuth, requirePermission(PERMISSIONS.VIEW), getSupplierReport);
router.get("/:id", requireAuth, requirePermission(PERMISSIONS.READ), getSupplier);
router.post("/", requireAuth, requirePermission(PERMISSIONS.CREATE), validateSupplier, createSupplier);
router.put("/:id", requireAuth, requirePermission(PERMISSIONS.UPDATE), validateSupplier, updateSupplier);
router.delete("/:id", requireAuth, requirePermission(PERMISSIONS.DELETE), deleteSupplier);

export default router;
