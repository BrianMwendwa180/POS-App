import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { fetchProducts } from '../../services/api';
import { Product } from '../../types';

interface ProductSearchProps {
  onAddToCart: (product: Product, quantity?: number) => void;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({ onAddToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'tire' | 'rim'>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filteredProducts = Array.isArray(products) ? products.filter((product: Product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.size?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filter === 'all' || product.type === filter;

    return matchesSearch && matchesFilter && product.stock > 0;
  }) : [];

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-slate-600">Loading products...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <div className="text-center py-8">
          <div className="text-red-600 mb-2">⚠️</div>
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Product Search</h3>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, brand, size, or SKU..."
            className="w-full pl-10 pr-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => setFilter('tire')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'tire' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tires
          </button>
          <button
            onClick={() => setFilter('rim')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'rim' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Rims
          </button>
        </div>
      </div>

      <div className="mt-6 max-h-80 sm:max-h-96 overflow-y-auto space-y-3">
        {filteredProducts.map((product, index) => (
  <div
    key={product.id ?? `${product.sku}-${index}`}   // ✅ safe fallback for missing/duplicate IDs
    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
  >

            <div className="flex-1 mb-3 sm:mb-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.type === 'tire' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}
                >
                  {product.type?.toUpperCase() ?? 'UNKNOWN'}
                </span>
                <span className="text-sm text-slate-500">Stock: {product.stock}</span>
              </div>
              <p className="font-medium text-slate-800 text-base sm:text-sm">{product.name ?? 'Unnamed Product'}</p>
              <p className="text-sm text-slate-600">
                {product.brand ?? 'Unknown Brand'} • {product.size ?? 'Unknown Size'}
              </p>
              <p className="text-lg font-semibold text-orange-600">${product.price?.toFixed(2) ?? '0.00'}</p>
            </div>
            <button
              onClick={() => onAddToCart(product)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium w-full sm:w-auto"
            >
              <Plus size={16} />
              Add to Cart
            </button>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <div className="text-4xl mb-2">🔍</div>
            <p className="font-medium">No products found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};
