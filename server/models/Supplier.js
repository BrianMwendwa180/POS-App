import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactPerson: { type: String },
  email: { type: String },
  phone: { type: String },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String }
  },
  paymentTerms: { type: String, default: "Net 30" },
  isActive: { type: Boolean, default: true },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model("Supplier", supplierSchema);
