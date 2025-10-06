import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { fetchPaymentAlerts } from '../../services/api';

interface PaymentAlert {
  _id: string;
  status: string;
  saleDate: string;
  totalAmount: number;
}

export const PaymentAlerts: React.FC = () => {
  const [failedPayments, setFailedPayments] = useState<PaymentAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPaymentAlerts = async () => {
      try {
        setLoading(true);
        const data = await fetchPaymentAlerts();
        setFailedPayments(data.failedPayments);
      } catch (err) {
        setError('Failed to load payment alerts');
      } finally {
        setLoading(false);
      }
    };
    loadPaymentAlerts();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 text-center">
        Loading payment alerts...
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
        <Bell className="text-purple-500" size={20} />
        <h3 className="text-lg font-semibold text-slate-800">Payment Alerts</h3>
      </div>

      {failedPayments.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <p>No payment alerts</p>
          <p className="text-sm mt-1">All payments processed successfully</p>
        </div>
      ) : (
        <div className="space-y-4">
          {failedPayments.map((alert) => (
            <div key={alert._id} className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="font-medium text-slate-800">Payment failed for sale on {new Date(alert.saleDate).toLocaleDateString()}</p>
              <p className="text-sm text-purple-600">Amount: ${alert.totalAmount.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
