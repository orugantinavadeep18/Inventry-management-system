import mongoose from "mongoose";
import Product from "../models/product.js";
import Order from "../models/order.js";

// GET all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
};

// POST new product
export const addProduct = async (req, res) => {
  const { name, price, stock, category, supplier, image } = req.body;
  try {
    const newProduct = new Product({ name, price, stock, category, supplier, image });
    const savedProduct = await newProduct.save();

    req.app.get("io").emit("products:updated"); // 🔁 Notify clients
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ message: "Failed to create product", error: err.message });
  }
};

// PUT update product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });

    req.app.get("io").emit("products:updated"); // 🔁 Notify clients
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update product", error: err.message });
  }
};

// DELETE product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    req.app.get("io").emit("products:updated"); // 🔁 Notify clients
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product", error: err.message });
  }
};

// POST /api/products/buy
export const buyProduct = async (req, res) => {
  const { customerId, productId, quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(customerId) || !mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid customer or product ID" });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (quantity > product.stock) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    product.stock -= quantity;
    await product.save();

    const newOrder = new Order({
      customerId: new mongoose.Types.ObjectId(customerId),
      productId: new mongoose.Types.ObjectId(productId),
      quantity,
    });

    await newOrder.save();

    req.app.get("io").emit("products:updated"); // 🔁 Notify clients

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (err) {
    console.error("❌ Error in buyProduct:", err.message);
    res.status(500).json({ message: "Failed to place order", error: err.message });
  }
};

// GET stock level distribution
export const getStockLevelDistribution = async (req, res) => {
  try {
    const products = await Product.find();
    const distribution = {
      "0-10": 0,
      "11-50": 0,
      "51-100": 0,
      "101+": 0,
    };

    products.forEach((product) => {
      const stock = product.stock;
      if (stock <= 10) distribution["0-10"] += 1;
      else if (stock <= 50) distribution["11-50"] += 1;
      else if (stock <= 100) distribution["51-100"] += 1;
      else distribution["101+"] += 1;
    });

    const formatted = Object.entries(distribution).map(([range, value]) => ({
      range,
      value,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("❌ Error in getStockLevelDistribution:", err);
    res.status(500).json({ error: "Failed to get stock distribution" });
  }
};
