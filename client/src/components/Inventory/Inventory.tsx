import React, { useState, useCallback } from 'react';
import { ProductList } from './ProductList';
import { ProductForm } from './ProductForm';
import { Plus } from 'lucide-react';
import { Product } from '../../types';

export const Inventory: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Used to force refresh of ProductList

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowAddForm(true);
  };

  const handleFormClose = () => {
    setShowAddForm(false);
    setEditingProduct(null);
  };

  const handleFormSuccess = useCallback(() => {
    // Force refresh of ProductList by updating the key
    setRefreshKey(prev => prev + 1);
  }, []);

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowAddForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Inventory Management</h2>
          <p className="text-slate-600">Manage your tire and rim inventory</p>
        </div>
        <button
          onClick={handleAddProduct}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <ProductList
        key={refreshKey}
        onEditProduct={handleEditProduct}
        onRefresh={handleFormSuccess}
      />

      {showAddForm && (
        <ProductForm
          product={editingProduct}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};