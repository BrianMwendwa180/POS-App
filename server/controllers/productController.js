import Product from "../models/Product.js";
import InventoryTransaction from "../models/InventoryTransaction.js";

// Get all products with pagination and filtering
export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, lowStock } = req.query;
    const skip = (page - 1) * limit;

    let query = { isActive: true };

    if (category) query.category = category;
    if (search) query.$text = { $search: search };
    if (lowStock === 'true') query.stock = { $lte: '$minStock' };

    const products = await Product.find(query)
      .populate('supplier', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('supplier', 'name');
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new product
export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();

    // Create initial inventory transaction
    if (product.stock > 0) {
      const transaction = new InventoryTransaction({
        product: product._id,
        quantity: product.stock,
        transactionType: "in",
        reference: "Initial stock"
      });
      await transaction.save();
    }

    await product.populate('supplier', 'name');
    res.status(201).json({ product });
  } catch (error) {
    // Allow duplicates for new products
    res.status(500).json({ error: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('supplier', 'name');

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ product });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: "Product with this barcode or SKU already exists" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

// Delete product (soft delete)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deactivated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update product stock
export const updateStock = async (req, res) => {
  try {
    const { quantity, transactionType, reference } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update stock
    if (transactionType === "in") {
      product.stock += quantity;
    } else if (transactionType === "out") {
      if (product.stock < quantity) {
        return res.status(400).json({ error: "Insufficient stock" });
      }
      product.stock -= quantity;
    }

    await product.save();

    // Create inventory transaction record
    const transaction = new InventoryTransaction({
      product: product._id,
      quantity,
      transactionType,
      reference: reference || "Manual adjustment"
    });
    await transaction.save();

    res.json({ product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get low stock products
export const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isActive: true,
      $expr: { $lte: ["$stock", "$minStock"] }
    }).populate('supplier', 'name');

    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
