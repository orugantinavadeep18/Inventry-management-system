import express from "express";
import {
  addCategory,
  getAllCategories,
  updateCategory,
  getCategoryStockShare,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

// Public or token-protected depending on your middleware
router.post("/add", addCategory);
router.get("/all", getAllCategories);
router.put("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);
router.get("/stock-share", getCategoryStockShare);

export default router;
