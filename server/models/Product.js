import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  brand: { type: String },
  size: { type: String },
  width: { type: Number },
  aspectRatio: { type: Number },
  rimDiameter: { type: Number },
  rimWidth: { type: Number },
  offset: { type: Number },
  boltPattern: { type: String },
  barcode: { type: String, sparse: false },
  price: { type: Number, required: true, min: 0 },
  cost: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  minStock: { type: Number, default: 10 },
  maxStock: { type: Number },
  sku: { type: String, unique: false },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  isActive: { type: Boolean, default: true },
  image: { type: String },
  taxRate: { type: Number, default: 0 },
  discount: { type: Number, default: 0 }
}, { timestamps: true, autoIndex: false, collection: 'products2' });

// Index for better search performance
productSchema.index({ name: 'text', category: 'text', brand: 'text', size: 'text' });

// Removed duplicate indexes to fix warnings
// productSchema.index({ barcode: 1 });
// productSchema.index({ sku: 1 });

export default mongoose.model("Product", productSchema);
