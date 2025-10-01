import mongoose from "mongoose";

const purchaseOrderSchema = new mongoose.Schema({
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    cost: { type: Number, required: true, min: 0 }
  }],
  totalAmount: { type: Number, required: true, min: 0 },
  orderDate: { type: Date, default: Date.now },
  expectedDeliveryDate: { type: Date },
  status: { type: String, enum: ["pending", "ordered", "received", "cancelled"], default: "pending" },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model("PurchaseOrder", purchaseOrderSchema);
