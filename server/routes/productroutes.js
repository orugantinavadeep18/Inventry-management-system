import express from "express";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  buyProduct,
  getStockLevelDistribution, // ✅ Add this
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", addProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

// ✅ Route to handle product purchase and order creation
router.post("/buy", buyProduct);

// ✅ New route: Stock level distribution for dashboard chart
router.get("/", getStockLevelDistribution);

export default router;
