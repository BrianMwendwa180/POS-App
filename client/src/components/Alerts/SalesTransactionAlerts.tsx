import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { fetchSalesAlerts } from '../../services/api';

interface Sale {
  _id: string;
  totalAmount: number;
  status: string;
  saleDate: string;
}

export const SalesTransactionAlerts: React.FC = () => {
  const [pendingOrCancelled, setPendingOrCancelled] = useState<Sale[]>([]);
  const [highValue, setHighValue] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        setLoading(true);
        const data = await fetchSalesAlerts();
        setPendingOrCancelled(data.pendingOrCancelled);
        setHighValue(data.highValue);
      } catch (err) {
        setError('Failed to load sales alerts');
      } finally {
        setLoading(false);
      }
    };
    loadAlerts();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 text-center">
        Loading sales alerts...
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
        <Bell className="text-blue-500" size={20} />
        <h3 className="text-lg font-semibold text-slate-800">Sales & Transaction Alerts</h3>
      </div>

      {pendingOrCancelled.length === 0 && highValue.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <p>No sales or transaction alerts</p>
          <p className="text-sm mt-1">All transactions are normal</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingOrCancelled.map((sale) => (
            <div key={sale._id} className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div>
                <p className="font-medium text-slate-800">Sale ID: {sale._id}</p>
                <p className="text-sm text-slate-600">Amount: ${sale.totalAmount.toFixed(2)}</p>
                <p className="text-sm text-yellow-600 font-medium">
                  Alert: Pending or cancelled transaction
                </p>
              </div>
            </div>
          ))}
          {highValue.map((sale) => (
            <div key={sale._id} className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div>
                <p className="font-medium text-slate-800">Sale ID: {sale._id}</p>
                <p className="text-sm text-slate-600">Amount: ${sale.totalAmount.toFixed(2)}</p>
                <p className="text-sm text-blue-600 font-medium">
                  Alert: High value transaction
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
