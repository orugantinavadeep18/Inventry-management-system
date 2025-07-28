import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String },
  supplier: { type: String },
  image: { type: String },
}, { timestamps: true });

// ✅ Prevent OverwriteModelError in watch mode
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
