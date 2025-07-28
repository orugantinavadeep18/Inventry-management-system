import express from "express";
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Get all suppliers
router.get("/", verifyToken, getSuppliers);

// ✅ Create a new supplier
router.post("/", verifyToken, createSupplier);

// ✅ Update supplier by ID
router.put("/:id", verifyToken, updateSupplier);

// ✅ Delete supplier by ID
router.delete("/:id", verifyToken, deleteSupplier);

export default router;
