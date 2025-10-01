import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  getLowStockProducts
} from "../controllers/productController.js";
import { requireAuth, requireManager } from "../middlewares/authMiddleware_new.js";
import { requirePermission, PERMISSIONS } from "../middlewares/permissionsMiddleware.js";
import { validateProduct } from "../middlewares/validationMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, requirePermission(PERMISSIONS.VIEW), getProducts);
router.get("/low-stock", requireAuth, requirePermission(PERMISSIONS.VIEW), getLowStockProducts);
router.get("/:id", requireAuth, requirePermission(PERMISSIONS.READ), getProduct);
router.post("/", requireAuth, requirePermission(PERMISSIONS.CREATE), validateProduct, createProduct);
router.put("/:id", requireAuth, requirePermission(PERMISSIONS.UPDATE), validateProduct, updateProduct);
router.delete("/:id", requireAuth, requirePermission(PERMISSIONS.DELETE), deleteProduct);
router.post("/:id/stock", requireAuth, requirePermission(PERMISSIONS.UPDATE), updateStock);

export default router;
