import React, { useState, useEffect } from 'react';
import { User, Search, Plus } from 'lucide-react';
import { fetchCustomers } from '../../services/api';
import { Customer } from '../../types';

interface CustomerSelectionProps {
  selectedCustomer: Customer | null;
  onCustomerSelect: (customer: Customer | null) => void;
}

export const CustomerSelection: React.FC<CustomerSelectionProps> = ({
  selectedCustomer,
  onCustomerSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomers, setShowCustomers] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const filteredCustomers = customers.filter((customer: Customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  );

  if (loading) {
    return <div>Loading customers...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <User size={20} />
        Customer
      </h3>
      
      {selectedCustomer ? (
        <div className="p-4 bg-slate-50 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
            <div className="flex-1">
              <p className="font-medium text-slate-800 text-base">{selectedCustomer.name}</p>
              {selectedCustomer.email && (
                <p className="text-sm text-slate-600">{selectedCustomer.email}</p>
              )}
              {selectedCustomer.phone && (
                <p className="text-sm text-slate-600">{selectedCustomer.phone}</p>
              )}
              <p className="text-sm text-slate-500 mt-2">
                Total purchases: ${selectedCustomer.totalPurchases.toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => onCustomerSelect(null)}
              className="text-red-500 hover:text-red-600 text-sm font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors self-start sm:self-center"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search customers..."
                className="w-full pl-10 pr-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowCustomers(true)}
              />
            </div>
            <button className="px-3 sm:px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex-shrink-0">
              <Plus size={16} />
            </button>
          </div>
          
          {showCustomers && (
            <div className="border border-slate-200 rounded-lg max-h-40 sm:max-h-48 overflow-y-auto">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <button
                    key={customer.id}
                    onClick={() => {
                      onCustomerSelect(customer);
                      setShowCustomers(false);
                      setSearchTerm('');
                    }}
                    className="w-full text-left p-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
                  >
                    <p className="font-medium text-slate-800 text-sm sm:text-base">{customer.name}</p>
                    <p className="text-sm text-slate-600">{customer.email || customer.phone}</p>
                  </button>
                ))
              ) : (
                <div className="p-3 text-center text-slate-500">
                  <div className="text-2xl mb-1">👤</div>
                  <p className="text-sm">No customers found</p>
                </div>
              )}
            </div>
          )}
          
          <button
            onClick={() => onCustomerSelect(null)}
            className="text-sm text-slate-600 hover:text-slate-800 transition-colors"
          >
            Continue without customer
          </button>
        </div>
      )}
    </div>
  );
};