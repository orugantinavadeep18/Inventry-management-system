import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Check if model already exists before defining it
const Notification =
  mongoose.models.Notification || mongoose.model("Notification", notificationSchema);

export default Notification;
