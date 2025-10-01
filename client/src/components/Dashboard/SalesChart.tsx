import React from 'react';
import { TrendingUp } from 'lucide-react';

export const SalesChart: React.FC = () => {
  const salesData = [
    { day: 'Mon', sales: 1200 },
    { day: 'Tue', sales: 1800 },
    { day: 'Wed', sales: 1500 },
    { day: 'Thu', sales: 2200 },
    { day: 'Fri', sales: 2800 },
    { day: 'Sat', sales: 3200 },
    { day: 'Sun', sales: 1900 },
  ];

  const maxSales = Math.max(...salesData.map(d => d.sales));

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="text-green-500" size={20} />
        <h3 className="text-lg font-semibold text-slate-800">Weekly Sales</h3>
      </div>
      
      <div className="flex items-end justify-between gap-2 h-64">
        {salesData.map((data, index) => {
          const height = (data.sales / maxSales) * 200;
          return (
            <div key={index} className="flex flex-col items-center gap-2 flex-1">
              <div 
                className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg transition-all duration-500 hover:from-orange-600 hover:to-orange-500"
                style={{ height: `${height}px` }}
                title={`$${data.sales}`}
              />
              <div className="text-center">
                <p className="text-xs font-medium text-slate-600">{data.day}</p>
                <p className="text-xs text-slate-500">${data.sales}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};