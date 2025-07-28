import mongoose from "mongoose";
import Order from "../models/order.js";
import Product from "../models/product.js";
import Notification from "../models/notification.js"; 
// import moment from "moment";import Notification from '../models/notification.js';
// import { sendEmail } from '../utils/sendEmail.js';
// import { sendAdminNotificationEmail } from "../utils/emailService.js";


// ✅ Get all active (incomplete) orders for a customer
// ✅ Properly fetch orders from DB and populate product/customer details
export const getOrders = async (req, res) => {
  const { customerId } = req.query;

  try {
    const query = customerId ? { customerId: customerId } : {};

    const orders = await Order.find(query)
      .populate("productId")
      .populate("customerId");

    const formatted = orders.map(order => ({
      _id: order._id,
      quantity: order.quantity,
      status: order.status,
      product: {
        name: order.productId?.name || "N/A",
        price: order.productId?.price || 0,
      },
      customer: {
        name: order.customerId?.name || "N/A",
        email: order.customerId?.email || "N/A"
      }
    }));

    console.log("📦 Orders sent to frontend:", formatted);
    res.json(formatted);
  } catch (err) {
    console.error("❌ Error in getOrders:", err.message);
    res.status(500).json({ message: "Error fetching orders" });
  }
};


// ✅ Remove quantity from an order (restore stock)
export const removeQuantity = async (req, res) => {
  const { orderId, quantity } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const product = await Product.findById(order.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (quantity > order.quantity) {
      return res.status(400).json({ message: "Quantity to remove exceeds order quantity" });
    }

    product.stock += quantity;
    await product.save();

    if (quantity === order.quantity) {
      await Order.findByIdAndDelete(orderId);
    } else {
      order.quantity -= quantity;
      await order.save();
    }

    res.json({ message: "Quantity removed and stock updated" });
  } catch (err) {
    console.error("❌ Error in removeQuantity:", err.message);
    res.status(500).json({ message: "Error processing removeQuantity" });
  }
};

// ✅ Mark order as completed
export const completeOrder = async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "completed"; // Important: use `status`, not `completed = true`
    await order.save();

    res.json({ message: "✅ Order marked as completed" });
  } catch (err) {
    console.error("❌ Error completing order:", err.message);
    res.status(500).json({ message: "Error completing order" });
  }
};

export const getOrdersGroupedByCustomer = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customerId')
      .populate('productId');

    const grouped = {};

    orders.forEach(order => {
      const name = order.customerId?.name || "Unknown";
      if (!grouped[name]) grouped[name] = [];

      grouped[name].push({
        productName: order.productId?.name || "Unknown Product",
        quantity: order.quantity
      });
    });

    const result = Object.entries(grouped).map(([name, orders]) => ({
      name,
      orders
    }));

    res.json(result);
  } catch (error) {
    console.error("❌ Error fetching orders per customer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



export const getCustomerOrders = async (req, res) => {
  try {
    const customerId = req.params.id;

    const orders = await Order.find({
      customer: customerId,
      status: { $ne: "completed" }, // Optional: filter out completed
    })
      .populate("product")
      .populate("customer");

    console.log("📦 Customer Orders:", orders);
    res.json(orders);
  } catch (err) {
    console.error("❌ Error in getCustomerOrders:", err.message);
    res.status(500).json({ error: "Failed to fetch customer orders" });
  }
};



// Mark order as completed
export const completeOrderById = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'completed' },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (err) {
    console.error("❌ Error completing order:", err);
    res.status(500).json({ error: 'Failed to complete order' });
  }
};

// ✅ Create new order
export const createOrder = async (req, res) => {
  const { customerId, productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (quantity > product.stock) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // ✅ Reduce stock
    product.stock -= quantity;
    await product.save();

    // ✅ Create order
    const newOrder = new Order({
      customerId: new mongoose.Types.ObjectId(customerId),
      productId,
      quantity,
    });
    await newOrder.save();

    // ✅ If stock drops below threshold, create notification + send email
    const minStockThreshold = 5;
    if (product.stock < minStockThreshold) {
      // 🔔 Save notification to DB
      await Notification.create({
        message: `⚠️ Low stock alert: ${product.name} has only ${product.stock} items left.`,
        productId: product._id,
        read: false,
      });

      // 📧 Send email alert to admin
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "your-admin-email@gmail.com",        // 🔁 Replace with your Gmail
          pass: "your-app-password",                 // 🔁 Use App Password from Google
        },
      });

      await transporter.sendMail({
        from: "your-admin-email@gmail.com",
        to: "a47982965@gmail.com",
        subject: "⚠️ Low Stock Alert",
        text: `Product "${product.name}" has dropped to ${product.stock} units.`,
      });
    }

    res.status(201).json({ message: "Order placed successfully", order: newOrder });

  } catch (err) {
    console.error("❌ Error in createOrder:", err.message);
    res.status(500).json({ message: "Failed to place order" });
  }
};