import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";

// Local imports
import connectDB from "./config/db.js";
import authRoutes from "./routes/Auth.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import productRoutes from "./routes/productroutes.js";
import userRoutes from "./routes/userRoutes.js";
import custProductRoutes from "./models/custProduct.js";
import orderRoutes from "./routes/orderRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import inventoryActivityRoutes from "./routes/inventoryActivityRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Initialize socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // update as needed
    methods: ["GET", "POST"],
  },
});

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect MongoDB
const MONGO_URI = process.env.MONGO_URI;
connectDB(MONGO_URI);

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", custProductRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/inventory", inventoryActivityRoutes);

// ✅ Root
app.get("/", (req, res) => {
  res.send("✅ API is running");
});

// ✅ Socket.io connection
let connectedSockets = [];

io.on("connection", (socket) => {
  console.log("🔌 New user connected:", socket.id);
  connectedSockets.push(socket);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    connectedSockets = connectedSockets.filter((s) => s.id !== socket.id);
  });
});

// ✅ Global emitter
export const emitUpdate = (event, data) => {
  io.emit(event, data);
};

// ✅ Low-stock check every 5 minutes
setInterval(async () => {
  try {
    const adminToken = process.env.ADMIN_TOKEN; // Ensure this is in your .env
    await axios.post(
      "http://localhost:5000/api/notifications/generate-low-stock",
      {},
      {
        headers: {
          Authorization: adminToken,
        },
      }
    );
    console.log("✅ Low-stock check triggered");
  } catch (error) {
    console.error("❌ Low stock notification generation failed:", error.message);
  }
}, 5 * 60 * 1000); // every 5 mins

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
