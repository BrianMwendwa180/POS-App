import mongoose from "mongoose";

const inventoryTransactionSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  transactionType: { type: String, enum: ["in", "out"], required: true },
  transactionDate: { type: Date, default: Date.now },
  reference: { type: String },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model("InventoryTransaction", inventoryTransactionSchema);
