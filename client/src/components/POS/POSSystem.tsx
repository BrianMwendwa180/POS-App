import React, { useState } from 'react';
import { ProductSearch } from './ProductSearch';
import { Cart } from './Cart';
import { CustomerSelection } from './CustomerSelection';
import { PaymentProcessor } from './PaymentProcessor';
import { createSale } from '../../services/api';
import { Product, Customer, SaleItem } from '../../types';

export const POSSystem: React.FC = () => {
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === product.id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity, total: (item.quantity + quantity) * item.price }
            : item
        );
      } else {
        return [...prevCart, {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          total: product.price * quantity,
        }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId
          ? { ...item, quantity, total: item.price * quantity }
          : item
      )
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (cart.length > 0) {
      setShowPayment(true);
    }
  };

  const handlePaymentComplete = async (paymentMethod: 'cash' | 'card' | 'check') => {
    try {
      // Prepare sale data
      const saleData = {
        products: cart.map(item => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        paymentMethod,
        customer: selectedCustomer?.id || null,
      };

      await createSale(saleData);

      setCart([]);
      setSelectedCustomer(null);
      setShowPayment(false);
      alert('Sale completed successfully!');
    } catch (error) {
      alert('Failed to complete sale. Please try again.');
    }
  };

  const clearCart = () => {
    setCart([]);
    setShowPayment(false);
  };

  return (
    <div className="p-4 sm:p-6 grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
      <div className="space-y-4 sm:space-y-6">
        <ProductSearch onAddToCart={addToCart} />
        <CustomerSelection
          selectedCustomer={selectedCustomer}
          onCustomerSelect={setSelectedCustomer}
        />
      </div>

      <div className="space-y-4 sm:space-y-6">
        <Cart
          items={cart}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onClearCart={clearCart}
          subtotal={subtotal}
          tax={tax}
          total={total}
          onCheckout={handleCheckout}
        />

        {showPayment && (
          <PaymentProcessor
            total={total}
            customer={selectedCustomer}
            items={cart}
            onPaymentComplete={(paymentMethod) => handlePaymentComplete(paymentMethod)}
            onCancel={() => setShowPayment(false)}
          />
        )}
      </div>
    </div>
  );
};