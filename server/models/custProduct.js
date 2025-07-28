// models/custProduct.js

import mongoose from "mongoose";

const custProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  quantity: Number,
}, { timestamps: true });

export default mongoose.models.CustProduct || mongoose.model("CustProduct", custProductSchema);
