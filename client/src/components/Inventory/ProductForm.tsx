import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Product } from '../../types';
import { createProduct, updateProduct } from '../../services/api';

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onSuccess: () => void; // Called after successful save to refresh data
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'tire' as 'tire' | 'rim',
    brand: '',
    size: '',
    width: '',
    aspectRatio: '',
    rimDiameter: '',
    rimWidth: '',
    offset: '',
    boltPattern: '',
    price: '',
    costPrice: '',
    stock: '',
    minStock: '',
    sku: '',
    description: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        type: product.type || 'tire',
        brand: product.brand || '',
        size: product.size || '',
        width: product.width?.toString() || '',
        aspectRatio: product.aspectRatio?.toString() || '',
        rimDiameter: product.rimDiameter?.toString() || '',
        rimWidth: product.rimWidth?.toString() || '',
        offset: product.offset?.toString() || '',
        boltPattern: product.boltPattern || '',
        price: (product.price || 0).toString(),
        costPrice: (product.costPrice || 0).toString(),
        stock: (product.stock || 0).toString(),
        minStock: (product.minStock || 0).toString(),
        sku: product.sku || '',
        description: product.description || '',
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Map frontend data to backend format
      const productData = {
        name: formData.name,
        category: formData.type, // Map tire/rim to category
        brand: formData.brand,
        size: formData.size,
        width: formData.width ? parseFloat(formData.width) : undefined,
        aspectRatio: formData.aspectRatio ? parseFloat(formData.aspectRatio) : undefined,
        rimDiameter: formData.rimDiameter ? parseFloat(formData.rimDiameter) : undefined,
        rimWidth: formData.rimWidth ? parseFloat(formData.rimWidth) : undefined,
        offset: formData.offset ? parseFloat(formData.offset) : undefined,
        boltPattern: formData.boltPattern || undefined,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.costPrice), // Map costPrice to cost
        stock: parseInt(formData.stock),
        minStock: parseInt(formData.minStock),
        sku: formData.sku,
        description: formData.description || undefined,
      };

      if (product) {
        // Update existing product
        await updateProduct(product.id, productData);
        setSuccess('Product updated successfully');
      } else {
        // Create new product
        await createProduct(productData);
        setSuccess('Product added successfully');
      }

      onSuccess(); // Refresh the product list
      onClose(); // Close the form
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving the product');
      setSuccess(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-slate-800">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Product Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="e.g., Michelin Pilot Sport 4S"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="tire">Tire</option>
                <option value="rim">Rim</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Brand</label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="e.g., Michelin, BBS, Enkei"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Size</label>
              <input
                type="text"
                required
                value={formData.size}
                onChange={(e) => handleInputChange('size', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="e.g., 245/35R20 or 20x9.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">SKU</label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => handleInputChange('sku', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="e.g., MICH-PS4S-245-35-20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Price</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Cost Price</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.costPrice}
                onChange={(e) => handleInputChange('costPrice', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Stock</label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => handleInputChange('stock', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Minimum Stock</label>
              <input
                type="number"
                required
                value={formData.minStock}
                onChange={(e) => handleInputChange('minStock', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="0"
              />
            </div>
          </div>

          {formData.type === 'tire' && (
            <div className="border-t pt-6">
              <h4 className="text-lg font-medium text-slate-800 mb-4">Tire Specifications</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Width (mm)</label>
                  <input
                    type="number"
                    value={formData.width}
                    onChange={(e) => handleInputChange('width', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="245"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Aspect Ratio</label>
                  <input
                    type="number"
                    value={formData.aspectRatio}
                    onChange={(e) => handleInputChange('aspectRatio', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="35"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Rim Diameter</label>
                  <input
                    type="number"
                    value={formData.rimDiameter}
                    onChange={(e) => handleInputChange('rimDiameter', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="20"
                  />
                </div>
              </div>
            </div>
          )}

          {formData.type === 'rim' && (
            <div className="border-t pt-6">
              <h4 className="text-lg font-medium text-slate-800 mb-4">Rim Specifications</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Diameter</label>
                  <input
                    type="number"
                    value={formData.rimDiameter}
                    onChange={(e) => handleInputChange('rimDiameter', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Width</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.rimWidth}
                    onChange={(e) => handleInputChange('rimWidth', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="9.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Offset</label>
                  <input
                    type="number"
                    value={formData.offset}
                    onChange={(e) => handleInputChange('offset', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="35"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Bolt Pattern</label>
                  <input
                    type="text"
                    value={formData.boltPattern}
                    onChange={(e) => handleInputChange('boltPattern', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="5x114.3"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Optional product description..."
            />
          </div>

          <div className="flex gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:bg-orange-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {product ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                product ? 'Update Product' : 'Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};