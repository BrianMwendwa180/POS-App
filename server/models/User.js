import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["admin", "manager", "cashier", "user"], default: "user" },
  isActive: { type: Boolean, default: true },
  permissions: {
    view: { type: Boolean, default: true },
    read: { type: Boolean, default: true },
    update: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
    create: { type: Boolean, default: false },
    manage: { type: Boolean, default: false }
  }
}, { timestamps: true });

// Pre-save middleware to set permissions based on role
userSchema.pre('save', function(next) {
  switch(this.role) {
    case 'manager':
      this.permissions = {
        view: true,
        read: true,
        update: true,
        delete: true,
        create: true,
        manage: true
      };
      break;
    case 'cashier':
      this.permissions = {
        view: true,
        read: true,
        update: true,
        delete: false,
        create: true,
        manage: false
      };
      break;
    case 'admin':
      this.permissions = {
        view: true,
        read: true,
        update: true,
        delete: true,
        create: true,
        manage: true
      };
      break;
    default: // user
      this.permissions = {
        view: true,
        read: true,
        update: false,
        delete: false,
        create: false,
        manage: false
      };
  }
  next();
});

export default mongoose.model("User", userSchema);
