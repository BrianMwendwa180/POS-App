import React, { useState, useEffect } from 'react';
import { fetchSalesSummary, fetchProducts, fetchCustomers, fetchSuppliers } from '../../services/api';
import { Product, Customer, Supplier } from '../../types';

interface SalesSummary {
  summary: {
    totalSales: number;
    totalRevenue: number;
    averageSale: number;
  };
  paymentMethods: Array<{
    _id: string;
    count: number;
    total: number;
  }>;
}

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [salesSummary, setSalesSummary] = useState<SalesSummary | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'sales') {
          const summary = await fetchSalesSummary();
          setSalesSummary(summary);
        } else if (activeTab === 'inventory') {
          const prods = await fetchProducts();
          setProducts(prods);
        } else if (activeTab === 'customers') {
          const custs = await fetchCustomers();
          setCustomers(custs);
        } else if (activeTab === 'suppliers') {
          const supps = await fetchSuppliers();
          setSuppliers(supps.suppliers);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [activeTab]);

  const tabs = [
    { id: 'sales', label: 'Sales Report' },
    { id: 'inventory', label: 'Inventory Report' },
    { id: 'customers', label: 'Customer Report' },
    { id: 'suppliers', label: 'Supplier Report' },
  ];

  return (
    <div className="reports-container p-4">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <div className="tabs flex space-x-4 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded ${activeTab === tab.id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {loading && <p>Loading...</p>}
      {!loading && activeTab === 'sales' && salesSummary && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Sales Summary</h2>
          <p>Total Sales: {salesSummary.summary.totalSales}</p>
          <p>Total Revenue: ${salesSummary.summary.totalRevenue.toFixed(2)}</p>
          <p>Average Sale: ${salesSummary.summary.averageSale.toFixed(2)}</p>
          <h3 className="text-lg font-semibold mt-4 mb-2">Payment Methods</h3>
          <ul>
            {salesSummary.paymentMethods.map(pm => (
              <li key={pm._id}>{pm._id}: {pm.count} transactions, total ${pm.total.toFixed(2)}</li>
            ))}
          </ul>
          <button
            onClick={() => exportToCSV(salesSummary.paymentMethods, 'sales_payment_methods.csv')}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
          >
            Export Payment Methods to CSV
          </button>
        </div>
      )}
      {!loading && activeTab === 'inventory' && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Inventory Report</h2>
          <ul>
            {products.map(product => (
              <li key={product.id}>{product.name} - Stock: {product.stock}</li>
            ))}
          </ul>
          <button
            onClick={() => exportToCSV(products, 'inventory.csv')}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
          >
            Export Inventory to CSV
          </button>
        </div>
      )}
      {!loading && activeTab === 'customers' && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Customer Report</h2>
          <ul>
            {customers.map(customer => (
              <li key={customer.id}>{customer.name} - Email: {customer.email}</li>
            ))}
          </ul>
          <button
            onClick={() => exportToCSV(customers, 'customers.csv')}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
          >
            Export Customers to CSV
          </button>
        </div>
      )}
      {!loading && activeTab === 'suppliers' && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Supplier Report</h2>
          <ul>
            {suppliers.map(supplier => (
              <li key={supplier.id}>{supplier.name} - Contact: {supplier.contactPerson || supplier.email || supplier.phone || 'N/A'}</li>
            ))}
          </ul>
          <button
            onClick={() => exportToCSV(suppliers, 'suppliers.csv')}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
          >
            Export Suppliers to CSV
          </button>
        </div>
      )}
    </div>
  );
};

export default Reports;
