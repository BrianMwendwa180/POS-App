import React from 'react';
import { DashboardStats } from './DashboardStats';
import { RecentSales } from './RecentSales';
import { LowStockAlerts } from './LowStockAlerts';
import { SalesChart } from './SalesChart';

export const Dashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <LowStockAlerts />
      </div>
      
      <RecentSales />
    </div>
  );
};