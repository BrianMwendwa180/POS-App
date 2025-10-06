import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { fetchCustomerAlerts } from '../../services/api';

interface Customer {
  _id: string;
  name: string;
  lastPurchase: string | null;
}

export const CustomerAlerts: React.FC = () => {
  const [inactiveCustomers, setInactiveCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCustomerAlerts = async () => {
      try {
        setLoading(true);
        const data = await fetchCustomerAlerts();
        setInactiveCustomers(data.inactiveCustomers);
      } catch (err) {
        setError('Failed to load customer alerts');
      } finally {
        setLoading(false);
      }
    };
    loadCustomerAlerts();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 text-center">
        Loading customer alerts...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="text-indigo-500" size={20} />
        <h3 className="text-lg font-semibold text-slate-800">Customer Alerts</h3>
      </div>

      {inactiveCustomers.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <p>No customer alerts</p>
          <p className="text-sm mt-1">All customers are in good standing</p>
        </div>
      ) : (
        <div className="space-y-4">
          {inactiveCustomers.map((customer) => (
            <div key={customer._id} className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
              <p className="font-medium text-slate-800">{customer.name}</p>
              <p className="text-sm text-indigo-600">
                Last purchase: {customer.lastPurchase ? new Date(customer.lastPurchase).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
