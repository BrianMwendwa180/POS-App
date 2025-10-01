import React from 'react';
import { Trash2, Minus, Plus, ShoppingCart } from 'lucide-react';
import { SaleItem } from '../../types';

interface CartProps {
  items: SaleItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  subtotal: number;
  tax: number;
  total: number;
  onCheckout: () => void;
}

export const Cart: React.FC<CartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  subtotal,
  tax,
  total,
  onCheckout,
}) => {
  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <ShoppingCart size={20} />
          Cart ({items.length})
        </h3>
        {items.length > 0 && (
          <button
            onClick={onClearCart}
            className="text-red-500 hover:text-red-600 text-sm font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
      
      {items.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <ShoppingCart size={48} className="mx-auto mb-4 text-slate-300" />
          <p>Cart is empty</p>
          <p className="text-sm mt-1">Add products to start a sale</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="max-h-48 sm:max-h-64 overflow-y-auto space-y-3">
            {items.map((item, index) => (
              <div
                key={item.productId ?? `${item.name}-${index}`}
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 border border-slate-200 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-slate-800 text-sm sm:text-base">{item.name}</p>
                  <p className="text-orange-600 font-semibold">${item.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center justify-between sm:flex-col sm:justify-center gap-2 sm:gap-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                      className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                      className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-800 text-sm">${item.total.toFixed(2)}</p>
                    <button
                      onClick={() => onRemoveItem(item.productId)}
                      className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-slate-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm sm:text-base">
              <span className="text-slate-600">Subtotal:</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span className="text-slate-600">Tax (8%):</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold border-t border-slate-200 pt-2">
              <span>Total:</span>
              <span className="text-orange-600">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={onCheckout}
            className="w-full bg-orange-500 text-white py-3 sm:py-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-base"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};
