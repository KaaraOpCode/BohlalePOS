'use client';
import { useState } from 'react';
import { Product } from '@/app/types';
import { Table } from '@/components/Market/Table';
import { Cart, CartItem } from '@/components/Market/Cart';
import { PaymentOptions } from '@/components/Payment/PaymentOptions';
import { MarketHeader } from '@/components/Market/MarketHeader';

const availableProducts: Product[] = [
  { id: '1', name: 'Wireless Headphones', price: 29.99, stock: 50, category: 'Electronics', status: 'active' },
  { id: '2', name: 'Cotton T-Shirt', price: 19.99, stock: 30, category: 'Clothing', status: 'active' },
  { id: '3', name: 'Bluetooth Speaker', price: 59.99, stock: 25, category: 'Electronics', status: 'active' },
  { id: '4', name: 'Notebook', price: 4.99, stock: 100, category: 'Stationery', status: 'active' },
  { id: '5', name: 'Organic Apple', price: 1.5, stock: 80, category: 'Groceries', status: 'active' },
];

const categories = ['Clothing', 'Electronics', 'Groceries', 'Stationery'];

export default function OrdersPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const idx = prev.findIndex(p => p.id === product.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx].quantity += 1;
        return copy;
      }
      return [...prev, { ...product, quantity: 1, cartIndex: Date.now() }];
    });
  };

  const updateQuantity = (cartIndex: number, qty: number) => {
    if (qty <= 0) return removeFromCart(cartIndex);
    setCartItems(prev => prev.map(i => (i.cartIndex === cartIndex ? { ...i, quantity: qty } : i)));
  };

  const removeFromCart = (cartIndex: number) => {
    setCartItems(prev => prev.filter(i => i.cartIndex !== cartIndex));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = subtotal * 0.1; // 10% discount
  const vatAmount = (subtotal - discountAmount) * 0.15; // 15% VAT
  const totalAmount = subtotal - discountAmount + vatAmount;

  // Filter products based on search text and category filter
  const filteredProducts = availableProducts.filter(p => {
    const matchText =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.includes(searchQuery);
    const matchCat = !filterCategory || p.category === filterCategory;
    return matchText && matchCat;
  });

  return (
    <main className="h-screen flex flex-col bg-gray-50">
      <MarketHeader />
      <div className="flex-1 grid grid-cols-2 gap-4 p-4 min-h-0">
        {/* Left column: Order Records with Search & Filter */}
        <div className="bg-white border border-gray-300 rounded-lg shadow-md flex flex-col min-h-0">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-2">Order Records</h2>
            <div className="grid grid-cols-2 gap-3 mb-2">
              <input
                type="text"
                placeholder="Search orders by name or ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="p-2 border rounded text-sm"
              />
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="p-2 border rounded text-sm"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-auto">
            <Table products={filteredProducts} onAddToCart={addToCart} />
          </div>
        </div>

        {/* Right column: Order Insights */}
        <div className="bg-white border border-gray-300 rounded-lg shadow-md flex flex-col min-h-0">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Order Insights</h2>
          </div>
          <Cart
            cartItems={cartItems}
            updateQuantity={updateQuantity}
            removeItem={removeFromCart}
            subtotal={subtotal}
            discountAmount={discountAmount}
            vatAmount={vatAmount}
            totalAmount={totalAmount}
            onProcessPayment={() => setShowPaymentOptions(true)}
          />
        </div>
      </div>

      {showPaymentOptions && (
        <PaymentOptions
          totalAmount={totalAmount}
          onCancel={() => setShowPaymentOptions(false)}
          onPaymentComplete={() => {
            setCartItems([]);
            setShowPaymentOptions(false);
          }}
        />
      )}
    </main>
  );
}
