import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { fetchSystemDeviceAlerts } from '../../services/api';

interface ProductAlert {
  _id: string;
  name: string;
  stock: number;
  category: string;
  maxStock?: number;
}

interface InventoryTransactionAlert {
  _id: string;
  product: { name: string };
  quantity: number;
  transactionDate: string;
}

export const SystemDeviceAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<{
    negativeStock: ProductAlert[];
    overStock: ProductAlert[];
    largeAdjustments: InventoryTransactionAlert[];
  }>({
    negativeStock: [],
    overStock: [],
    largeAdjustments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSystemDeviceAlerts = async () => {
      try {
        setLoading(true);
        const data = await fetchSystemDeviceAlerts();
        setAlerts(data.systemAlerts);
      } catch (err) {
        setError('Failed to load system/device alerts');
      } finally {
        setLoading(false);
      }
    };
    loadSystemDeviceAlerts();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 text-center">
        Loading system/device alerts...
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
        <Bell className="text-green-500" size={20} />
        <h3 className="text-lg font-semibold text-slate-800">System/Device Alerts</h3>
      </div>

      {alerts.negativeStock.length === 0 && alerts.overStock.length === 0 && alerts.largeAdjustments.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <p>No system or device alerts</p>
          <p className="text-sm mt-1">All systems are operational</p>
        </div>
      ) : (
        <div className="space-y-6">
          {alerts.negativeStock.length > 0 && (
            <div>
              <h4 className="font-semibold text-red-600 mb-2">Negative Stock Products</h4>
              {alerts.negativeStock.map(product => (
                <div key={product._id} className="p-4 bg-red-50 border border-red-200 rounded-lg mb-2">
                  <p className="font-medium text-red-700">{product.name} (Category: {product.category})</p>
                  <p className="text-sm text-red-600">Stock: {product.stock}</p>
                </div>
              ))}
            </div>
          )}
          {alerts.overStock.length > 0 && (
            <div>
              <h4 className="font-semibold text-yellow-600 mb-2">Overstock Products</h4>
              {alerts.overStock.map(product => (
                <div key={product._id} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-2">
                  <p className="font-medium text-yellow-700">{product.name} (Category: {product.category})</p>
                  <p className="text-sm text-yellow-600">Stock: {product.stock} (Max: {product.maxStock})</p>
                </div>
              ))}
            </div>
          )}
          {alerts.largeAdjustments.length > 0 && (
            <div>
              <h4 className="font-semibold text-blue-600 mb-2">Large Inventory Adjustments (Last 7 days)</h4>
              {alerts.largeAdjustments.map(tx => (
                <div key={tx._id} className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-2">
                  <p className="font-medium text-blue-700">{tx.product.name}</p>
                  <p className="text-sm text-blue-600">Quantity adjusted: {tx.quantity}</p>
                  <p className="text-sm text-blue-600">Date: {new Date(tx.transactionDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
