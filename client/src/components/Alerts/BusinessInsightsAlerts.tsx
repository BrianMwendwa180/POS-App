import React from 'react';
import { Bell } from 'lucide-react';

const mockBusinessInsightsAlerts = [
  { id: 1, message: 'Monthly sales target not met', date: '2024-06-09' },
  { id: 2, message: 'New market opportunity detected', date: '2024-06-10' },
];

export const BusinessInsightsAlerts: React.FC = () => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="text-teal-500" size={20} />
        <h3 className="text-lg font-semibold text-slate-800">Business Insights Alerts</h3>
      </div>

      {mockBusinessInsightsAlerts.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <p>No business insights alerts</p>
          <p className="text-sm mt-1">Business is performing as expected</p>
        </div>
      ) : (
        <div className="space-y-4">
          {mockBusinessInsightsAlerts.map((alert) => (
            <div key={alert.id} className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
              <p className="font-medium text-slate-800">{alert.message}</p>
              <p className="text-sm text-teal-600">{alert.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
