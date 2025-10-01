import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }
  }],
  totalAmount: { type: Number, required: true, min: 0 },
  paymentMethod: { type: String, enum: ["cash", "card", "mobile"], required: true },
  customer: { type: String },
  cashier: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  saleDate: { type: Date, default: Date.now },
  status: { type: String, enum: ["completed", "pending", "cancelled"], default: "completed" }
}, { timestamps: true });

export default mongoose.model("Sale", saleSchema);
