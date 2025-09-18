// components/Market/Table.tsx
import React from 'react';
import { Product } from '@/app/types';

interface TableProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export function Table({ products, onAddToCart }: TableProps) {
  return (
    <table className="min-w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
          <th className="border border-gray-300 px-4 py-2 text-right">Price (LSL)</th>
          <th className="border border-gray-300 px-4 py-2 text-right">Stock</th>
          <th className="border border-gray-300 px-4 py-2 text-center">Status</th>
          <th className="border border-gray-300 px-4 py-2 text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => (
          <tr key={product.id} className="hover:bg-gray-50">
            <td className="border border-gray-300 px-4 py-2">{product.name}</td>
            <td className="border border-gray-300 px-4 py-2">{product.category}</td>
            <td className="border border-gray-300 px-4 py-2 text-right">{product.price.toFixed(2)}</td>
            <td className="border border-gray-300 px-4 py-2 text-right">{product.stock}</td>
            <td className="border border-gray-300 px-4 py-2 text-center capitalize">{product.status}</td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                onClick={() => onAddToCart(product)}
                disabled={product.stock === 0 || product.status !== 'active'}
              >
                Add
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
