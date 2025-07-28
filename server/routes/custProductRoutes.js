// routes/productRoutes.js
import express from "express";
import { getAllProducts, placeOrder } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAllProducts);           // GET /api/products
router.post("/order", placeOrder);         // POST /api/products/order

export default router;
