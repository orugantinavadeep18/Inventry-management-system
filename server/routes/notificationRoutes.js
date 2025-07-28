import express from "express";
import {
  getNotifications,
  markNotificationAsRead,
  generateLowStockNotifications,
} from "../controllers/notificationController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getNotifications);
router.put("/:id/read", verifyToken, markNotificationAsRead);
router.post("/", verifyToken, generateLowStockNotifications);

export default router;
