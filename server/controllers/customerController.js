import Customer from "../models/Customer.js";
import Sale from "../models/Sale.js";

// Get all customers
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });

    // Calculate totalPurchases and lastPurchase from sales
    const customersWithStats = await Promise.all(
      customers.map(async (customer) => {
        const sales = await Sale.find({ customer: customer.name });
        const totalPurchases = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
        const lastPurchase = sales.length > 0
          ? sales.sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate))[0].saleDate
          : null;

        return {
          ...customer.toObject(),
          totalPurchases,
          lastPurchase,
        };
      })
    );

    res.json(customersWithStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single customer
export const getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Calculate stats
    const sales = await Sale.find({ customer: customer.name }).sort({ saleDate: -1 });
    const totalPurchases = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const lastPurchase = sales.length > 0 ? sales[0].saleDate : null;

    // Get recent 5 sales
    const recentSales = sales.slice(0, 5).map(sale => ({
      id: sale._id,
      total: sale.totalAmount,
      saleDate: sale.saleDate,
      paymentMethod: sale.paymentMethod,
      status: sale.status,
      createdAt: sale.createdAt,
    }));

    res.json({
      ...customer.toObject(),
      totalPurchases,
      lastPurchase,
      recentSales,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create customer
export const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    // Check if customer with same name exists
    const existingCustomer = await Customer.findOne({ name });
    if (existingCustomer) {
      return res.status(400).json({ error: "Customer with this name already exists" });
    }

    const customer = new Customer({
      name,
      email,
      phone,
      address,
    });

    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update customer
export const updateCustomer = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Check if updating name and it conflicts
    if (name && name !== customer.name) {
      const existingCustomer = await Customer.findOne({ name });
      if (existingCustomer) {
        return res.status(400).json({ error: "Customer with this name already exists" });
      }
    }

    customer.name = name || customer.name;
    customer.email = email !== undefined ? email : customer.email;
    customer.phone = phone !== undefined ? phone : customer.phone;
    customer.address = address !== undefined ? address : customer.address;

    await customer.save();
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete customer
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
