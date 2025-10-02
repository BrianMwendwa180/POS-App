import React, { useState, useCallback, useEffect } from 'react';
import { SupplierList } from './SupplierList';
import { SupplierForm } from './SupplierForm';
import { Plus, AlertCircle } from 'lucide-react';
import { Supplier } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { fetchSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../../services/api';

export const Suppliers: React.FC = () => {
  const { user } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const canManage = user?.role === 'admin' || user?.role === 'manager' || user?.role === 'cashier';

  const loadSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchSuppliers();
      setSuppliers(response.suppliers);
    } catch (err: any) {
      setError(err.message || 'Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  const handleAddSupplier = () => {
    if (!canManage) return;
    setEditingSupplier(null);
    setShowAddForm(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    if (!canManage) return;
    setEditingSupplier(supplier);
    setShowAddForm(true);
  };

  const handleViewSupplier = (supplier: Supplier) => {
    // For now, view is same as edit
    handleEditSupplier(supplier);
  };

  const handleDeleteSupplier = async (supplierId: string) => {
    if (!canManage) return;
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;

    try {
      await deleteSupplier(supplierId);
      loadSuppliers();
    } catch (err: any) {
      alert(`Failed to delete supplier: ${err.message}`);
    }
  };

  const handleFormSave = async (supplierData: Partial<Supplier>) => {
    try {
      if (editingSupplier) {
        await updateSupplier(editingSupplier.id, supplierData);
      } else {
        await createSupplier(supplierData);
      }
      setShowAddForm(false);
      setEditingSupplier(null);
      loadSuppliers();
    } catch (err: any) {
      alert(`Failed to save supplier: ${err.message}`);
    }
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
    setEditingSupplier(null);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading suppliers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          <AlertCircle className="mx-auto mb-2" size={48} />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Supplier Management</h2>
          <p className="text-slate-600">Manage your suppliers and their information</p>
        </div>
        {canManage && (
          <button
            onClick={handleAddSupplier}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus size={20} />
            Add Supplier
          </button>
        )}
      </div>

      {!canManage && (
        <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          You do not have permission to manage suppliers. Only Admin, Manager, and Cashier roles can perform these actions.
        </div>
      )}

      <SupplierList
        suppliers={suppliers}
        onEdit={canManage ? handleEditSupplier : () => {}}
        onView={handleViewSupplier}
        onDelete={canManage ? handleDeleteSupplier : () => {}}
      />

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <SupplierForm
              supplier={editingSupplier}
              onSave={handleFormSave}
              onCancel={handleFormCancel}
              isEditing={!!editingSupplier}
            />
          </div>
        </div>
      )}
    </div>
  );
};
