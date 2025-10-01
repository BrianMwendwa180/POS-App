import React, { useState, useEffect } from 'react';
import { Users, Plus, Mail, Phone, Edit, Eye, Download, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchCustomers, createCustomer, updateCustomer, deleteCustomer, getCustomer } from '../../services/api';
import { Customer, Sale } from '../../types';

export const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({ name: '', email: '', phone: '', address: '' });
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [sortBy, setSortBy] = useState<string>('name');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCustomers();
        setCustomers(data);
      } catch (err) {
        setError('Failed to load customers');
      } finally {
        setLoading(false);
      }
    };
    loadCustomers();
  }, []);

  const sortedCustomers = [...customers].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'totalPurchases') return b.totalPurchases - a.totalPurchases;
    if (sortBy === 'lastPurchase') {
      const aDate = a.lastPurchase ? new Date(a.lastPurchase).getTime() : 0;
      const bDate = b.lastPurchase ? new Date(b.lastPurchase).getTime() : 0;
      return bDate - aDate;
    }
    return 0;
  });

  const filteredCustomers = sortedCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.phone && customer.phone.includes(searchTerm))
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddCustomer = async () => {
    if (!newCustomer.name) {
      alert('Name is required');
      return;
    }
    try {
      const created = await createCustomer(newCustomer);
      setCustomers([created, ...customers]);
      setNewCustomer({ name: '', email: '', phone: '', address: '' });
      setShowAddForm(false);
    } catch (err) {
      alert('Failed to add customer');
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await deleteCustomer(id);
      setCustomers(customers.filter(c => c.id !== id));
    } catch (err) {
      alert('Failed to delete customer');
    }
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setNewCustomer({ name: customer.name, email: customer.email, phone: customer.phone, address: customer.address });
    setShowEditForm(true);
  };

  const handleUpdateCustomer = async () => {
    if (!editingCustomer || !newCustomer.name) return;
    try {
      const updated = await updateCustomer(editingCustomer.id, newCustomer);
      setCustomers(customers.map(c => c.id === editingCustomer.id ? { ...updated, totalPurchases: c.totalPurchases, lastPurchase: c.lastPurchase } : c));
      setShowEditForm(false);
      setEditingCustomer(null);
      setNewCustomer({ name: '', email: '', phone: '', address: '' });
    } catch (err) {
      alert('Failed to update customer');
    }
  };

  const handleViewDetails = async (customer: Customer) => {
    try {
      const fullCustomer = await getCustomer(customer.id);
      setSelectedCustomer(fullCustomer);
      setShowDetailsModal(true);
    } catch (err) {
      alert('Failed to load customer details');
    }
  };

  const handleExportCSV = () => {
    const csv = 'Name,Email,Phone,Address,Total Purchases,Last Purchase\n' +
      customers.map(c => `${c.name},${c.email || ''},${c.phone || ''},${c.address || ''},${c.totalPurchases},${c.lastPurchase || ''}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    a.click();
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').slice(1); // skip header
      for (const line of lines) {
        const [name, email, phone, address] = line.split(',');
        if (name) {
          try {
            await createCustomer({ name, email, phone, address });
          } catch (err) {
            console.error('Failed to import customer:', name);
          }
        }
      }
      // Reload customers
      const data = await fetchCustomers();
      setCustomers(data);
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy]);

  if (loading) {
    return <div className="p-6">Loading customers...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Customer Management</h2>
          <p className="text-slate-600">Manage your customer database</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Download size={20} />
            Export CSV
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
            <Upload size={20} />
            Import CSV
            <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
          </label>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus size={20} />
            {showAddForm ? 'Cancel' : 'Add Customer'}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 border border-slate-300 rounded-lg bg-white shadow-sm max-w-md">
          <h3 className="text-lg font-semibold mb-4">Add New Customer</h3>
          <input
            type="text"
            placeholder="Name"
            value={newCustomer.name || ''}
            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
            className="w-full mb-2 p-2 border border-slate-300 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={newCustomer.email || ''}
            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
            className="w-full mb-2 p-2 border border-slate-300 rounded"
          />
          <input
            type="text"
            placeholder="Phone"
            value={newCustomer.phone || ''}
            onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
            className="w-full mb-2 p-2 border border-slate-300 rounded"
          />
          <input
            type="text"
            placeholder="Address"
            value={newCustomer.address || ''}
            onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
            className="w-full mb-2 p-2 border border-slate-300 rounded"
          />
          <button
            onClick={handleAddCustomer}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Save
          </button>
        </div>
      )}

      {showEditForm && (
        <div className="mb-6 p-4 border border-slate-300 rounded-lg bg-white shadow-sm max-w-md">
          <h3 className="text-lg font-semibold mb-4">Edit Customer</h3>
          <input
            type="text"
            placeholder="Name"
            value={newCustomer.name || ''}
            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
            className="w-full mb-2 p-2 border border-slate-300 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={newCustomer.email || ''}
            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
            className="w-full mb-2 p-2 border border-slate-300 rounded"
          />
          <input
            type="text"
            placeholder="Phone"
            value={newCustomer.phone || ''}
            onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
            className="w-full mb-2 p-2 border border-slate-300 rounded"
          />
          <input
            type="text"
            placeholder="Address"
            value={newCustomer.address || ''}
            onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
            className="w-full mb-2 p-2 border border-slate-300 rounded"
          />
          <div className="flex gap-2">
            <button
              onClick={handleUpdateCustomer}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => { setShowEditForm(false); setEditingCustomer(null); setNewCustomer({ name: '', email: '', phone: '', address: '' }); }}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-4 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-0 p-2 border border-slate-300 rounded"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded"
        >
          <option value="name">Sort by Name</option>
          <option value="totalPurchases">Sort by Total Purchases</option>
          <option value="lastPurchase">Sort by Last Purchase</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center gap-2 flex-wrap">
          <Users className="text-orange-500" size={24} />
          <h3 className="text-lg font-semibold text-slate-800 flex-grow">All Customers</h3>
          <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-sm">
            {filteredCustomers.length} ({paginatedCustomers.length} shown)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
          {paginatedCustomers.map((customer) => (
            <div key={customer.id} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white font-semibold">
                    {customer.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleViewDetails(customer)}
                    className="text-blue-500 hover:text-blue-700 p-1"
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleEditCustomer(customer)}
                    className="text-green-500 hover:text-green-700 p-1"
                    title="Edit Customer"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteCustomer(customer.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete Customer"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6 6L14 14M14 6L6 14" />
                    </svg>
                  </button>
                </div>
              </div>

              <h4 className="font-semibold text-slate-800 mb-2">{customer.name}</h4>

              <div className="space-y-2 text-sm text-slate-600 flex-grow">
                {customer.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={14} />
                    <span>{customer.email}</span>
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} />
                    <span>{customer.phone}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center text-sm text-slate-600">
                <div>
                  <p>Total Purchases</p>
                  <p className="font-semibold text-green-600">${customer.totalPurchases.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p>Last Visit</p>
                  <p className="font-medium text-slate-800">
                    {customer.lastPurchase ? new Date(customer.lastPurchase).toLocaleDateString() : 'Never'}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {filteredCustomers.length === 0 && (
            <p className="text-center text-slate-500 col-span-full">No customers found.</p>
          )}
        </div>
      </div>

      {showDetailsModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-full overflow-auto p-6 relative">
            <button
              onClick={() => setShowDetailsModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              title="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-xl font-semibold mb-4">{selectedCustomer.name}</h3>
            <p><strong>Email:</strong> {selectedCustomer.email || 'N/A'}</p>
            <p><strong>Phone:</strong> {selectedCustomer.phone || 'N/A'}</p>
            <p><strong>Address:</strong> {selectedCustomer.address || 'N/A'}</p>
            <p><strong>Total Purchases:</strong> ${selectedCustomer.totalPurchases.toFixed(2)}</p>
            <p><strong>Last Purchase:</strong> {selectedCustomer.lastPurchase ? new Date(selectedCustomer.lastPurchase).toLocaleDateString() : 'Never'}</p>
            <h4 className="mt-4 font-semibold">Recent Purchases</h4>
            {selectedCustomer.recentSales && selectedCustomer.recentSales.length > 0 ? (
              <ul className="list-disc list-inside max-h-48 overflow-auto">
                {selectedCustomer.recentSales.map((sale: Sale) => (
                  <li key={sale.id}>
                    ${sale.total.toFixed(2)} on {new Date(sale.createdAt).toLocaleDateString()} ({sale.paymentMethod}, {sale.status})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No recent purchases.</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
