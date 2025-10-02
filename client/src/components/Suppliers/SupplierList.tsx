import React from 'react';
import { Truck, Mail, Phone, Edit, Eye, MapPin } from 'lucide-react';
import { Supplier } from '../../types';

interface SupplierListProps {
  suppliers: Supplier[];
  onEdit: (supplier: Supplier) => void;
  onView: (supplier: Supplier) => void;
  onDelete: (supplierId: string) => void;
}

export const SupplierList: React.FC<SupplierListProps> = ({ suppliers, onEdit, onView, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200 flex items-center gap-2">
        <Truck className="text-orange-500" size={24} />
        <h3 className="text-lg font-semibold text-slate-800 flex-grow">All Suppliers</h3>
        <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-sm">
          {suppliers.length} suppliers
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
        {suppliers.map((supplier) => (
          <div key={supplier.id} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shrink-0">
                <span className="text-white font-semibold">
                  {supplier.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => onView(supplier)}
                  className="text-blue-500 hover:text-blue-700 p-1"
                  title="View Details"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => onEdit(supplier)}
                  className="text-green-500 hover:text-green-700 p-1"
                  title="Edit Supplier"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => onDelete(supplier.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Delete Supplier"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6 6L14 14M14 6L6 14" />
                  </svg>
                </button>
              </div>
            </div>

            <h4 className="font-semibold text-slate-800 mb-2">{supplier.name}</h4>

            <div className="space-y-2 text-sm text-slate-600 flex-grow">
              {supplier.contactPerson && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Contact:</span>
                  <span>{supplier.contactPerson}</span>
                </div>
              )}
              {supplier.email && (
                <div className="flex items-center gap-2">
                  <Mail size={14} />
                  <span>{supplier.email}</span>
                </div>
              )}
              {supplier.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={14} />
                  <span>{supplier.phone}</span>
                </div>
              )}
              {supplier.address && (supplier.address.city || supplier.address.state) && (
                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  <span>{[supplier.address.city, supplier.address.state].filter(Boolean).join(', ')}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center text-sm text-slate-600">
              <div>
                <p>Payment Terms</p>
                <p className="font-semibold text-slate-800">{supplier.paymentTerms || 'N/A'}</p>
              </div>
              <div className="text-right">
                <p>Status</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  supplier.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {supplier.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        ))}
        {suppliers.length === 0 && (
          <p className="text-center text-slate-500 col-span-full">No suppliers found.</p>
        )}
      </div>
    </div>
  );
};
