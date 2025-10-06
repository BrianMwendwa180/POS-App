import InventoryTransaction from "../models/InventoryTransaction.js";
import Product from "../models/Product.js";
import { Parser } from 'json2csv';

// Get inventory transactions with pagination
export const getInventoryTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 20, product, transactionType, startDate, endDate } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    if (product) query.product = product;
    if (transactionType) query.transactionType = transactionType;
    if (startDate && endDate) {
      query.transactionDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const transactions = await InventoryTransaction.find(query)
      .populate('product', 'name category sku')
      .sort({ transactionDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await InventoryTransaction.countDocuments(query);

    res.json({
      transactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalTransactions: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get current inventory levels
export const getInventoryLevels = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .select('name category stock minStock maxStock sku barcode')
      .sort({ stock: 1 });

    const inventorySummary = {
      totalProducts: products.length,
      lowStockProducts: products.filter(p => p.stock <= p.minStock).length,
      outOfStockProducts: products.filter(p => p.stock === 0).length,
      totalValue: 0
    };

    // Calculate total inventory value
    for (const product of products) {
      inventorySummary.totalValue += product.stock * product.price;
    }

    res.json({
      products,
      summary: inventorySummary
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Manual inventory adjustment
export const adjustInventory = async (req, res) => {
  try {
    const { productId, quantity, reason } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const oldStock = product.stock;
    product.stock = quantity;
    await product.save();

    // Create inventory transaction
    const transaction = new InventoryTransaction({
      product: productId,
      quantity: quantity - oldStock,
      transactionType: quantity > oldStock ? "in" : "out",
      reference: reason || "Manual adjustment",
      notes: `Adjusted from ${oldStock} to ${quantity}`
    });
    await transaction.save();

    res.json({
      message: "Inventory adjusted successfully",
      product,
      transaction
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get inventory alerts (low stock, etc.)
export const getInventoryAlerts = async (req, res) => {
  try {
    const lowStockProducts = await Product.find({
      isActive: true,
      $expr: { $lte: ["$stock", "$minStock"] }
    }).select('name stock minStock category');

    const outOfStockProducts = await Product.find({
      isActive: true,
      stock: 0
    }).select('name category sku');

    const overStockProducts = await Product.find({
      isActive: true,
      $expr: { $gt: ["$stock", "$maxStock"] }
    }).select('name stock maxStock category');

    res.json({
      alerts: {
        lowStock: lowStockProducts,
        outOfStock: outOfStockProducts,
        overStock: overStockProducts
      },
      counts: {
        lowStock: lowStockProducts.length,
        outOfStock: outOfStockProducts.length,
        overStock: overStockProducts.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get inventory value report
export const getInventoryValueReport = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .select('name category stock price cost');

    let totalValue = 0;
    let totalCost = 0;

    const report = products.map(product => {
      const value = product.stock * product.price;
      const cost = product.stock * product.cost;
      totalValue += value;
      totalCost += cost;

      return {
        product: product.name,
        category: product.category,
        stock: product.stock,
        unitPrice: product.price,
        unitCost: product.cost,
        totalValue: value,
        totalCost: cost,
        profit: value - cost
      };
    });

    res.json({
      report,
      summary: {
        totalProducts: products.length,
        totalValue,
        totalCost,
        totalProfit: totalValue - totalCost
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get system device alerts
export const getSystemDeviceAlerts = async (req, res) => {
  try {
    // Products with negative stock (system error)
    const negativeStockProducts = await Product.find({
      isActive: true,
      stock: { $lt: 0 }
    }).select('name stock category');

    // Overstock products
    const overStockProducts = await Product.find({
      isActive: true,
      $expr: { $gt: ["$stock", "$maxStock"] }
    }).select('name stock maxStock category');

    // Recent inventory transactions with large adjustments (potential errors)
    const recentTransactions = await InventoryTransaction.find({
      transactionDate: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // last 7 days
    })
      .populate('product', 'name')
      .sort({ transactionDate: -1 })
      .limit(20);

    const largeAdjustments = recentTransactions.filter(t => Math.abs(t.quantity) > 100);

    res.json({
      systemAlerts: {
        negativeStock: negativeStockProducts,
        overStock: overStockProducts,
        largeAdjustments
      },
      counts: {
        negativeStock: negativeStockProducts.length,
        overStock: overStockProducts.length,
        largeAdjustments: largeAdjustments.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export inventory report to CSV
export const exportInventoryReport = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .select('name category stock minStock maxStock sku barcode price cost')
      .sort({ stock: 1 });

    const data = products.map(product => ({
      Name: product.name,
      Category: product.category,
      Stock: product.stock,
      MinStock: product.minStock,
      MaxStock: product.maxStock,
      SKU: product.sku,
      Barcode: product.barcode,
      Price: product.price,
      Cost: product.cost,
      Status: product.stock <= product.minStock ? 'Low Stock' : 'In Stock'
    }));

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment('inventory_report.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
