import React from 'react';
import { mockSales } from '../../data/mockData';

export const RecentSales: React.FC = () => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Sales</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Customer</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Items</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Total</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Payment</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {mockSales.map((sale) => (
              <tr key={sale.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-slate-800">{sale.customerName}</p>
                    <p className="text-sm text-slate-500">#{sale.id}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <p className="text-slate-800">{sale.items.length} items</p>
                </td>
                <td className="py-3 px-4">
                  <p className="font-semibold text-slate-800">${sale.total.toFixed(2)}</p>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    sale.paymentMethod === 'card' 
                      ? 'bg-blue-100 text-blue-800'
                      : sale.paymentMethod === 'cash'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {sale.paymentMethod.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-600">
                  {new Date(sale.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};