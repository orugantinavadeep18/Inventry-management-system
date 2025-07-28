// controllers/userController.js
import mongoose from "mongoose";

import User from '../models/user.js';
import bcrypt from 'bcryptjs';

// GET all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // exclude password
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// ADD a new user
export const addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      address,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: "User added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to add user" });
  }
};

// DELETE user by ID
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;

    const updatedUser = await user.save();

    // Return without password
    const { password, ...userData } = updatedUser.toObject();
    res.json(userData);
  } catch (err) {
    console.error("❌ Error updating user:", err.message);
    res.status(500).json({ error: "Failed to update user" });
  }
};
