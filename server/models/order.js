import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  status: { type: String, default: "pending" },
}, { timestamps: true });

// ✅ Prevent OverwriteModelError in development
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
