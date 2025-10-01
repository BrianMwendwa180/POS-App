import Supplier from "../models/Supplier.js";
import Product from "../models/Product.js";

// Get all suppliers
export const getSuppliers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } }
      ];
    }

    const suppliers = await Supplier.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Supplier.countDocuments(query);

    res.json({
      suppliers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalSuppliers: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single supplier
export const getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    // Get products supplied by this supplier
    const products = await Product.find({ supplier: req.params.id, isActive: true })
      .select('name category stock price');

    res.json({ supplier, products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new supplier
export const createSupplier = async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    await supplier.save();
    res.status(201).json({ supplier });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: "Supplier with this email already exists" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

// Update supplier
export const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    res.json({ supplier });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: "Supplier with this email already exists" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

// Delete supplier (soft delete)
export const deleteSupplier = async (req, res) => {
  try {
    // Check if supplier has associated products
    const productCount = await Product.countDocuments({ supplier: req.params.id, isActive: true });
    if (productCount > 0) {
      return res.status(400).json({
        error: "Cannot delete supplier with associated products. Deactivate instead."
      });
    }

    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    res.json({ message: "Supplier deactivated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get supplier performance report
export const getSupplierReport = async (req, res) => {
  try {
    const suppliers = await Supplier.find({ isActive: true });

    const report = await Promise.all(
      suppliers.map(async (supplier) => {
        const products = await Product.find({ supplier: supplier._id, isActive: true })
          .select('name stock price cost');

        const totalProducts = products.length;
        const totalValue = products.reduce((sum, product) => sum + (product.stock * product.price), 0);
        const totalCost = products.reduce((sum, product) => sum + (product.stock * product.cost), 0);

        return {
          supplier: supplier.name,
          contactPerson: supplier.contactPerson,
          email: supplier.email,
          totalProducts,
          totalValue,
          totalCost,
          profit: totalValue - totalCost
        };
      })
    );

    res.json({ report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
