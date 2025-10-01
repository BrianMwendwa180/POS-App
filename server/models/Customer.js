import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, sparse: true },
  phone: { type: String },
  address: { type: String },
  totalPurchases: { type: Number, default: 0 },
  lastPurchase: { type: Date },
}, { timestamps: true });

export default mongoose.model("Customer", customerSchema);
