import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { fetchStaffSecurityAlerts } from '../../services/api';

interface Staff {
  _id: string;
  name: string;
  role: 'manager' | 'cashier' | 'admin';
}

export const StaffSecurityAlerts: React.FC = () => {
  const [inactiveStaff, setInactiveStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStaffSecurityAlerts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required');
          setInactiveStaff([]);
          setLoading(false);
          return;
        }
        const data = await fetchStaffSecurityAlerts();
        setInactiveStaff(data.inactiveStaff);
      } catch (err: any) {
        console.error('Error loading staff security alerts:', err);
        setError(`Failed to load staff security alerts: ${err.message || err.toString()}`);
      } finally {
        setLoading(false);
      }
    };
    loadStaffSecurityAlerts();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 text-center">
        Loading staff security alerts...
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
        <Bell className="text-red-500" size={20} />
        <h3 className="text-lg font-semibold text-slate-800">Staff & Security Alerts</h3>
      </div>

      {inactiveStaff.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <p>No staff or security alerts</p>
          <p className="text-sm mt-1">All staff accounts are active</p>
        </div>
      ) : (
        <div className="space-y-4">
          {inactiveStaff.map((staff) => (
            <div key={staff._id} className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="font-medium text-slate-800">{staff.name} ({staff.role})</p>
              <p className="text-sm text-red-600">No sales processed in last 30 days</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
