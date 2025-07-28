// backend/routes/inventoryActivityRoutes.js
import express from "express";
import moment from "moment";
import Order from "../models/order.js"; // Adjust path as needed

const router = express.Router();

// GET /api/inventory/activity - Weekly order count
router.get("/activity", async (req, res) => {
  try {
    const startOfWeek = moment().startOf("week");
    const endOfWeek = moment().endOf("week");

    const orders = await Order.find({
      createdAt: { $gte: startOfWeek.toDate(), $lte: endOfWeek.toDate() },
    });

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const result = days.map(day => ({ day, orders: 0 }));

    orders.forEach(order => {
      const day = moment(order.createdAt).format("dddd");
      const match = result.find(d => d.day === day);
      if (match) match.orders += 1;
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching weekly orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/activity", (req, res) => {
  const fakeData = [
    { day: "Mon", orders: 5 },
    { day: "Tue", orders: 8 },
    { day: "Wed", orders: 3 },
    { day: "Thu", orders: 9 },
    { day: "Fri", orders: 7 },
    { day: "Sat", orders: 4 },
    { day: "Sun", orders: 6 },
  ];
  res.json(fakeData);
});


export default router;
