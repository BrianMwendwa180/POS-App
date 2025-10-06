import React from 'react';
import { InventoryAlerts } from './InventoryAlerts';
import { SalesTransactionAlerts } from './SalesTransactionAlerts';
import { PaymentAlerts } from './PaymentAlerts';
import { StaffSecurityAlerts } from './StaffSecurityAlerts';
import { SystemDeviceAlerts } from './SystemDeviceAlerts';
import { CustomerAlerts } from './CustomerAlerts';
import { BusinessInsightsAlerts } from './BusinessInsightsAlerts';

export const Alerts: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Notifications</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InventoryAlerts />
        <SalesTransactionAlerts />
        <PaymentAlerts />
        <StaffSecurityAlerts />
        <SystemDeviceAlerts />
        <CustomerAlerts />
        <BusinessInsightsAlerts />
      </div>
    </div>
  );
};
