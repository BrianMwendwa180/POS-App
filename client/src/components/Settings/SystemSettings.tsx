import React, { useState } from 'react';
import { Database, Download, Upload, Trash2, RefreshCw, Save } from 'lucide-react';

export const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily', // daily, weekly, monthly
    dataRetention: '2years', // 1year, 2years, 5years
    enableLogging: true,
    maintenanceMode: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // TODO: Implement API call to update system settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('System settings updated successfully!');
    } catch (error) {
      setMessage('Failed to update system settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackup = async () => {
    try {
      // TODO: Implement backup functionality
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Backup completed successfully!');
    } catch (error) {
      alert('Backup failed. Please try again.');
    }
  };

  const handleRestore = async () => {
    if (window.confirm('Are you sure you want to restore from backup? This will overwrite current data.')) {
      try {
        // TODO: Implement restore functionality
        await new Promise(resolve => setTimeout(resolve, 3000));
        alert('Restore completed successfully!');
      } catch (error) {
        alert('Restore failed. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">System Settings</h3>
        <p className="text-slate-600">Manage system-wide settings and maintenance options.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="text-slate-600" size={20} />
            <h4 className="text-lg font-semibold text-slate-800">Data Management</h4>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
              <div>
                <p className="font-medium text-slate-800">Automatic Backups</p>
                <p className="text-sm text-slate-600">Automatically backup data regularly</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="autoBackup"
                  checked={settings.autoBackup}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Backup Frequency
              </label>
              <select
                name="backupFrequency"
                value={settings.backupFrequency}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Data Retention Period
              </label>
              <select
                name="dataRetention"
                value={settings.dataRetention}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="1year">1 Year</option>
                <option value="2years">2 Years</option>
                <option value="5years">5 Years</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Backup & Restore</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleBackup}
              className="flex items-center gap-3 p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Download className="text-slate-600" size={20} />
              <div className="text-left">
                <p className="font-medium text-slate-800">Create Backup</p>
                <p className="text-sm text-slate-600">Download current data</p>
              </div>
            </button>

            <button
              type="button"
              onClick={handleRestore}
              className="flex items-center gap-3 p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <Upload className="text-slate-600" size={20} />
              <div className="text-left">
                <p className="font-medium text-slate-800">Restore Backup</p>
                <p className="text-sm text-slate-600">Upload and restore data</p>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">System Maintenance</h4>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
              <div>
                <p className="font-medium text-slate-800">Enable System Logging</p>
                <p className="text-sm text-slate-600">Log system activities for debugging</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="enableLogging"
                  checked={settings.enableLogging}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-red-200 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium text-red-800">Maintenance Mode</p>
                <p className="text-sm text-red-600">Temporarily disable the system for maintenance</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            <div className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg">
              <RefreshCw className="text-slate-600" size={20} />
              <div className="flex-1">
                <p className="font-medium text-slate-800">Clear Cache</p>
                <p className="text-sm text-slate-600">Clear temporary data and cache</p>
              </div>
              <button className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm">
                Clear
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {message && (
            <div className={`p-4 rounded-lg ${message.includes('successfully') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save size={16} />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
