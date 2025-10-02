'use client';
import { useState, useEffect } from 'react';
import { Product } from '@/app/types';
import { PaymentOptions } from '@/components/Payment/PaymentOptions';
import { MarketHeader } from '@/components/Market/MarketHeader';
import { ProductList } from '@/components/Market/ProductList';
import { Cart, CartItem } from '@/components/Market/Cart';

const availableProducts: Product[] = [
  { id: '1', name: 'Wireless Headphones', price: 29.99, stock: 50, category: 'Electronics', status: 'active' },
  { id: '2', name: 'Cotton T-Shirt', price: 19.99, stock: 30, category: 'Clothing', status: 'active' },
  { id: '3', name: 'Bluetooth Speaker', price: 59.99, stock: 25, category: 'Electronics', status: 'active' },
  { id: '4', name: 'Notebook', price: 4.99, stock: 100, category: 'Stationery', status: 'active' },
  { id: '5', name: 'Organic Apple', price: 1.5, stock: 80, category: 'Groceries', status: 'active' },
  { id: '6', name: 'LED Lamp', price: 12.99, stock: 40, category: 'Electronics', status: 'active' },
  { id: '7', name: 'Jeans', price: 39.99, stock: 25, category: 'Clothing', status: 'active' },
  { id: '8', name: 'Pencils Pack', price: 2.5, stock: 200, category: 'Stationery', status: 'active' },
];

const categories = ['Clothing', 'Electronics', 'Groceries', 'Stationery', 'Toys'];

export default function MarketPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Till operations
  const [transactionCount, setTransactionCount] = useState(0);
  const [sessionStart] = useState<Date>(new Date());
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [shopExpanded, setShopExpanded] = useState(true);
  const [cashierExpanded, setCashierExpanded] = useState(true);
  const [highlightTxn, setHighlightTxn] = useState(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (highlightTxn) {
      const timer = setTimeout(() => setHighlightTxn(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [highlightTxn]);

  useEffect(() => {
    if (addedProductId) {
      const timer = setTimeout(() => setAddedProductId(null), 300);
      return () => clearTimeout(timer);
    }
  }, [addedProductId]);

  // Cart operations
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
    setAddedProductId(product.id);
  };

  const updateQuantity = (cartIndex: number, qty: number) => {
    if (qty <= 0) return removeFromCart(cartIndex);
    setCartItems(prev => prev.map(i => (i.cartIndex === cartIndex ? { ...i, quantity: qty } : i)));
  };

  const removeFromCart = (cartIndex: number) => {
    setCartItems(prev => prev.filter(i => i.cartIndex !== cartIndex));
  };

  // Pricing
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountRate = 0.1;
  const discountAmount = subtotal * discountRate;
  const vatRate = 0.15;
  const vatAmount = (subtotal - discountAmount) * vatRate;
  const totalAmount = subtotal - discountAmount + vatAmount;

  const filteredProducts = availableProducts.filter(p => {
    const matchText = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.includes(searchQuery);
    const matchCat = !filterCategory || p.category === filterCategory;
    return matchText && matchCat;
  });

  useEffect(() => {
    if (paymentCompleted) {
      const timer = setTimeout(() => setPaymentCompleted(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [paymentCompleted]);

  const handleReceiptOption = (option: string) => {
    setShowReceiptModal(false);
    console.log(`Receipt option selected: ${option}`);
  };

  return (
    <>
      <main className="h-screen flex flex-col bg-gray-50">
        <MarketHeader />

        {/* Till Operations */}
        <div className="grid grid-cols-2 gap-4 p-4 sticky top-0 bg-gray-50 z-10">
          {/* Shop Card */}
          <div
            className={`bg-white rounded-lg shadow-md border p-4 cursor-pointer transition-all ${
              shopExpanded ? 'max-h-80' : 'max-h-12 overflow-hidden'
            }`}
            onClick={() => setShopExpanded(prev => !prev)}
          >
            <h2 className="text-lg font-semibold mb-2">Shop Details</h2>
            {shopExpanded && (
              <ul className="space-y-1 text-sm text-gray-700">
                <li><strong>Shop:</strong> Downtown Store</li>
                <li><strong>Current Time:</strong> {currentTime.toLocaleTimeString()}</li>
                <li><strong>Session Start:</strong> {sessionStart.toLocaleTimeString()}</li>
                <li>
                  <strong>Session Duration:</strong> {Math.floor((currentTime.getTime() - sessionStart.getTime()) / 60000)} min
                </li>
                <li><strong>VAT Number:</strong> VAT-123456789</li>
                <li><strong>Terminal ID:</strong> TILL-01</li>
              </ul>
            )}
          </div>

          {/* Cashier Card */}
          <div
            className={`bg-white rounded-lg shadow-md border p-4 cursor-pointer transition-all ${
              cashierExpanded ? 'max-h-80' : 'max-h-12 overflow-hidden'
            }`}
            onClick={() => setCashierExpanded(prev => !prev)}
          >
            <h2 className="text-lg font-semibold mb-2">Cashier Session</h2>
            {cashierExpanded && (
              <ul className="space-y-1 text-sm text-gray-700">
                <li><strong>Cashier:</strong> John Doe</li>
                <li><strong>Shift:</strong> Morning</li>
                <li><strong>Till Number:</strong> 4</li>
                <li className={`${highlightTxn ? 'text-green-600 font-bold animate-pulse' : ''}`}>
                  <strong>Total Transactions:</strong> {transactionCount}
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Products & Cart Grid */}
        <div className="flex-1 grid grid-cols-2 gap-4 p-4 min-h-0">
          {/* Products Panel */}
          <div className="bg-white border border-gray-300 rounded-lg shadow-md flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold mb-3">Product Categories</h2>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Search products..."
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
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: 'calc(3 * 80px + 3 * 16px)' }}>
              <ProductList products={filteredProducts} onAddToCart={addToCart} />
            </div>
          </div>

          {/* Cart Panel */}
          <div className="bg-white border border-gray-300 rounded-lg shadow-md flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Current Order</h2>
            </div>

            {/* Scrollable Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <p className="text-gray-500 text-sm">Cart is empty.</p>
              ) : (
                <Cart
                  cartItems={cartItems}
                  updateQuantity={updateQuantity}
                  removeItem={removeFromCart}
                  subtotal={subtotal}
                  discountAmount={discountAmount}
                  vatAmount={vatAmount}
                  totalAmount={totalAmount}
                  onProcessPayment={() => {}}
                />
              )}
            </div>

            {/* Sticky Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 text-sm space-y-2 sticky bottom-0">
              <div className="flex justify-between"><span>Subtotal:</span><span>LSL {subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Discount:</span><span>- LSL {discountAmount.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>VAT (15%):</span><span>+ LSL {vatAmount.toFixed(2)}</span></div>
              <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2">
                <span>Grand Total:</span><span>LSL {totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Total Items:</span><span className="font-semibold">{cartItems.reduce((acc, i) => acc + i.quantity, 0)}</span>
              </div>
              <button
                className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-green-600 text-white hover:bg-green-700 w-full px-4 py-2 text-base"
                onClick={() => setShowPaymentOptions(true)}
                disabled={cartItems.length === 0}
              >
                Process Payment
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Payment Dialog */}
      {showPaymentOptions && (
        <PaymentOptions
          totalAmount={totalAmount}
          onCancel={() => setShowPaymentOptions(false)}
          onPaymentComplete={() => {
            setCartItems([]);
            setShowPaymentOptions(false);
            setShowReceiptModal(true);
            setPaymentCompleted(true);
            setTransactionCount(prev => prev + 1);
            setHighlightTxn(true);
          }}
        />
      )}

      {/* Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">How would you like to receive your receipt?</h2>
            <div className="grid gap-3">
              <button onClick={() => handleReceiptOption('print')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Print Receipt</button>
              <button onClick={() => handleReceiptOption('email')} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Email Receipt</button>
              <button onClick={() => handleReceiptOption('qr')} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Generate QR Code</button>
              <button onClick={() => handleReceiptOption('none')} className="text-gray-600 underline hover:text-gray-800">No Receipt</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
