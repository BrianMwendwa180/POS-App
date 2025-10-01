import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Package, Loader2, RefreshCw, X } from 'lucide-react';
import { Product } from '../../types';
import { fetchProducts, deleteProduct } from '../../services/api';

interface ProductListProps {
  onEditProduct: (product: Product) => void;
  onRefresh?: () => void; // Optional refresh callback
}

export const ProductList: React.FC<ProductListProps> = ({ onEditProduct, onRefresh }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'tire' | 'rim'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'price'>('name');

  // Fetch products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await deleteProduct(productId);
      // Refresh the products list
      await loadProducts();
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  const filteredAndSortedProducts = products
    .filter((product: Product) => {
      const matchesSearch =
        (product.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (product.brand?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (product.sku?.toLowerCase() || '').includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === 'all' || product.type === typeFilter;

      return matchesSearch && matchesType;
    })
    .sort((a: Product, b: Product) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'stock':
          return b.stock - a.stock;
        case 'price':
          return b.price - a.price;
        default:
          return 0;
      }
    });

  const getStockStatus = (product: Product) => {
    if (product.stock <= 0) return { status: 'out', color: 'text-red-600 bg-red-100' };
    if (product.stock <= product.minStock) return { status: 'low', color: 'text-orange-600 bg-orange-100' };
    return { status: 'good', color: 'text-green-600 bg-green-100' };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center">
            <p className="text-red-800 text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          {loading && (
            <div className="flex items-center gap-2 text-slate-600">
              <Loader2 size={16} className="animate-spin" />
              Loading products...
            </div>
          )}

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as 'all' | 'tire' | 'rim')}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Types</option>
              <option value="tire">Tires</option>
              <option value="rim">Rims</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'stock' | 'price')}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="name">Sort by Name</option>
              <option value="stock">Sort by Stock</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-4 font-medium text-slate-700">Product</th>
              <th className="text-left p-4 font-medium text-slate-700">Type</th>
              <th className="text-left p-4 font-medium text-slate-700">Size</th>
              <th className="text-left p-4 font-medium text-slate-700">Stock</th>
              <th className="text-left p-4 font-medium text-slate-700">Price</th>
              <th className="text-left p-4 font-medium text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedProducts.map((product, index) => {
              const stockStatus = getStockStatus(product);
              return (
                <tr
                  key={product.id ?? `${product.sku ?? 'no-sku'}-${index}`}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-slate-800">{product.name || 'Unnamed Product'}</p>
                      <p className="text-sm text-slate-600">{product.brand || 'No Brand'}</p>
                      <p className="text-xs text-slate-500">{product.sku || 'No SKU'}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.type === 'tire'
                          ? 'bg-blue-100 text-blue-800'
                          : product.type === 'rim'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.type ? product.type.toUpperCase() : 'UNKNOWN'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-sm">{product.size || 'N/A'}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                      {product.stock || 0} units
                    </span>
                    {(product.stock || 0) <= (product.minStock || 0) && (
                      <p className="text-xs text-orange-600 mt-1">Low stock!</p>
                    )}
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-slate-800">${(product.price || 0).toFixed(2)}</p>
                    <p className="text-xs text-slate-500">Cost: ${(product.costPrice || 0).toFixed(2)}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEditProduct(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <Loader2 size={48} className="mx-auto text-slate-300 mb-4 animate-spin" />
          <p className="text-slate-500">Loading products...</p>
        </div>
      ) : filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">No products found</p>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
          <button
            onClick={loadProducts}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      ) : null}
    </div>
  );
};
