// controllers/productController.js
import Product from "../models/custProduct.js"
import Order from "../models/order.js"

// GET all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST new order
export const placeOrder = async (req, res) => {
  const { productId, quantity, customerEmail } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    // Create order
    const order = new Order({ productId, quantity, customerEmail });
    await order.save();

    // Decrease stock
    product.stock -= quantity;
    await product.save();

    res.status(201).json({ message: "Order placed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
