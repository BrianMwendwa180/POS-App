import React, { useState } from 'react';
import { CreditCard, DollarSign, FileText, X } from 'lucide-react';
import { Customer, SaleItem } from '../../types';

interface PaymentProcessorProps {
  total: number;
  customer: Customer | null;
  items: SaleItem[];
  onPaymentComplete: (paymentMethod: 'cash' | 'card' | 'check') => void;
  onCancel: () => void;
}

export const PaymentProcessor: React.FC<PaymentProcessorProps> = ({
  total,
  customer,
  items,
  onPaymentComplete,
  onCancel,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'check'>('card');
  const [cashReceived, setCashReceived] = useState(total);
  const [isProcessing, setIsProcessing] = useState(false);

  const change = cashReceived - total;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    onPaymentComplete(paymentMethod);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-slate-800">Process Payment</h3>
          <button
            onClick={onCancel}
            className="text-slate-500 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4 sm:space-y-6">
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-600 text-sm sm:text-base">Total Amount:</span>
              <span className="text-xl sm:text-2xl font-bold text-orange-600">${total.toFixed(2)}</span>
            </div>
            {customer && (
              <p className="text-sm text-slate-600">Customer: {customer.name}</p>
            )}
            <p className="text-sm text-slate-500">{items.length} items</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Payment Method</label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'cash'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <DollarSign className="mx-auto mb-1 sm:mb-2 text-green-600" size={20} />
                <p className="text-xs sm:text-sm font-medium">Cash</p>
              </button>

              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <CreditCard className="mx-auto mb-1 sm:mb-2 text-blue-600" size={20} />
                <p className="text-xs sm:text-sm font-medium">Card</p>
              </button>

              <button
                onClick={() => setPaymentMethod('check')}
                className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'check'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <FileText className="mx-auto mb-1 sm:mb-2 text-purple-600" size={20} />
                <p className="text-xs sm:text-sm font-medium">Check</p>
              </button>
            </div>
          </div>
          
          {paymentMethod === 'cash' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Cash Received</label>
              <input
                type="number"
                step="0.01"
                value={cashReceived}
                onChange={(e) => setCashReceived(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              {change >= 0 ? (
                <p className="text-sm text-green-600 mt-1">Change: ${change.toFixed(2)}</p>
              ) : (
                <p className="text-sm text-red-600 mt-1">Insufficient amount</p>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 sm:py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={isProcessing || (paymentMethod === 'cash' && change < 0)}
              className="flex-1 px-4 py-3 sm:py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isProcessing ? 'Processing...' : 'Complete Sale'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};