import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { mockProducts } from '../../data/mockData';

export const LowStockAlerts: React.FC = () => {
  const lowStockProducts = mockProducts.filter(product => product.stock <= product.minStock);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="text-red-500" size={20} />
        <h3 className="text-lg font-semibold text-slate-800">Low Stock Alerts</h3>
      </div>
      
      {lowStockProducts.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <p>No low stock alerts</p>
          <p className="text-sm mt-1">All products are well stocked</p>
        </div>
      ) : (
        <div className="space-y-4">
          {lowStockProducts.map((product) => (
            <div key={product.id} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
              <div>
                <p className="font-medium text-slate-800">{product.name}</p>
                <p className="text-sm text-slate-600">{product.brand} • {product.size}</p>
                <p className="text-sm text-red-600 font-medium">
                  Only {product.stock} left (Min: {product.minStock})
                </p>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                Reorder
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};