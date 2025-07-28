import express from 'express';
import { getAllUsers,updateUser, addUser, deleteUser } from '../controllers/userController.js';
import User from '../models/user.js'; // ✅ Add this line

const router = express.Router();

router.get('/all', getAllUsers);
router.put("/:id", updateUser);
router.post('/add', addUser);
router.delete('/delete/:id', deleteUser);

// ✅ Update user by ID
router.put("/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update user", error: err.message });
  }
});
router.get("/top-active", async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "customer" } })
      .limit(5)
      .select("name activityScore"); // ensure `activityScore` exists or replace with your field
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch top active users" });
  }
});

router.get("/top-active", async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "customer" } })
      .sort({ activityScore: -1 }) // or whatever you track
      .limit(5)
      .select("name activityScore");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch top active users" });
  }
});

export default router;
