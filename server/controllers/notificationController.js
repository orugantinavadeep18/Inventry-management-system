import Notification from "../models/notification.js";
import Product from "../models/Product.js";

// GET all notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ date: -1 });
    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT mark notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      read: true,
      updatedAt: new Date(),
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to mark as read" });
  }
};

// POST generate low stock notifications
export const generateLowStockNotifications = async (req, res) => {
  try {
    const lowStockProducts = await Product.find({ stock: { $lte: 5 } });

    for (const product of lowStockProducts) {
      const exists = await Notification.findOne({
        message: `⚠️ Low stock alert: ${product.name}`,
        read: false,
      });

      if (!exists) {
        await Notification.create({
          message: `⚠️ Low stock alert: ${product.name}`,
        });
      }
    }

    res.json({ success: true, message: "Low stock notifications generated." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
