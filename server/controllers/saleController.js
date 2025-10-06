import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import InventoryTransaction from "../models/InventoryTransaction.js";
import User from "../models/User.js";
import { Parser } from 'json2csv';

// Create new sale
export const createSale = async (req, res) => {
  try {
    const { products, paymentMethod, customer } = req.body;

    let totalAmount = 0;
    const saleProducts = [];

    // Validate products and calculate total
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ error: `Product ${item.product} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        });
      }

      const price = item.price || product.price;
      totalAmount += price * item.quantity;

      saleProducts.push({
        product: item.product,
        quantity: item.quantity,
        price: price
      });
    }

    // Create sale
    const sale = new Sale({
      products: saleProducts,
      totalAmount,
      paymentMethod,
      customer,
      cashier: req.user._id
    });

    await sale.save();

    // Update product stock and create inventory transactions
    for (const item of saleProducts) {
      const product = await Product.findById(item.product);
      product.stock -= item.quantity;
      await product.save();

      // Create inventory transaction
      const transaction = new InventoryTransaction({
        product: item.product,
        quantity: item.quantity,
        transactionType: "out",
        reference: `Sale ${sale._id}`
      });
      await transaction.save();
    }

    await sale.populate([
      { path: 'products.product', select: 'name category' },
      { path: 'cashier', select: 'name' }
    ]);

    res.status(201).json({ sale });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all sales with pagination
export const getSales = async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate, cashier } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    if (startDate && endDate) {
      query.saleDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (cashier) query.cashier = cashier;

    const sales = await Sale.find(query)
      .populate('products.product', 'name category price')
      .populate('cashier', 'name')
      .sort({ saleDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Sale.countDocuments(query);

    res.json({
      sales,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalSales: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single sale
export const getSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('products.product', 'name category price')
      .populate('cashier', 'name');

    if (!sale) {
      return res.status(404).json({ error: "Sale not found" });
    }

    res.json({ sale });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get sales summary
export const getSalesSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let matchQuery = {};
    if (startDate && endDate) {
      matchQuery.saleDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const summary = await Sale.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
          averageSale: { $avg: "$totalAmount" }
        }
      }
    ]);

    const paymentMethodSummary = await Sale.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 },
          total: { $sum: "$totalAmount" }
        }
      }
    ]);

    res.json({
      summary: summary[0] || { totalSales: 0, totalRevenue: 0, averageSale: 0 },
      paymentMethods: paymentMethodSummary
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get sales alerts
export const getSalesAlerts = async (req, res) => {
  try {
    // Pending or cancelled sales
    const pendingOrCancelled = await Sale.find({
      status: { $in: ['pending', 'cancelled'] }
    })
      .populate('products.product', 'name')
      .populate('cashier', 'name')
      .sort({ saleDate: -1 })
      .limit(10);

    // High value sales (above 1000)
    const highValue = await Sale.find({
      totalAmount: { $gt: 1000 },
      status: 'completed'
    })
      .populate('products.product', 'name')
      .populate('cashier', 'name')
      .sort({ saleDate: -1 })
      .limit(10);

    res.json({
      pendingOrCancelled,
      highValue
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get payment alerts
export const getPaymentAlerts = async (req, res) => {
  try {
    // Cancelled sales as payment failures
    const failedPayments = await Sale.find({
      status: 'cancelled'
    })
      .populate('products.product', 'name')
      .populate('cashier', 'name')
      .sort({ saleDate: -1 })
      .limit(10);

    res.json({
      failedPayments
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get staff security alerts
export const getStaffSecurityAlerts = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Staff who have processed sales in last 30 days
    const activeStaffIds = await Sale.distinct('cashier', {
      saleDate: { $gte: thirtyDaysAgo }
    });

    const allStaff = await User.find({ role: { $in: ['cashier', 'manager'] } });
    const inactiveStaffDetails = allStaff.filter(staff => !activeStaffIds.some(id => id.equals(staff._id)));

    res.json({
      inactiveStaff: inactiveStaffDetails.slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export sales report to CSV
export const exportSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = {};
    if (startDate && endDate) {
      query.saleDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const sales = await Sale.find(query)
      .populate('products.product', 'name')
      .populate('cashier', 'name')
      .sort({ saleDate: -1 });

    const data = sales.map(sale => ({
      SaleID: sale._id,
      Date: sale.saleDate.toISOString().split('T')[0],
      TotalAmount: sale.totalAmount,
      PaymentMethod: sale.paymentMethod,
      Cashier: sale.cashier.name,
      Products: sale.products.map(p => `${p.product.name} (${p.quantity})`).join('; ')
    }));

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment('sales_report.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
