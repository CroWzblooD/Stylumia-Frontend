import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('M'); // Default size

  const handleAddToCart = () => {
    const productToAdd = {
      id: product.id || Math.random().toString(36).substr(2, 9), // Fallback random ID if none exists
      name: product.title || product.name,
      price: parseFloat(product.price.replace('$', '')),
      image: product.image,
      size: selectedSize,
      sustainabilityScore: parseInt(product.sustainabilityScore || 0),
      carbonSaved: parseFloat(product.carbonSaved || '0'),
      description: product.description,
      quantity: 1
    };

    addToCart(productToAdd);
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="relative h-64 mb-4">
        <div className="absolute top-2 right-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
          Saves {product.carbonSaved || '0'}kg CO₂
        </div>
        <Image
          src={product.image}
          alt={product.title || product.name}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {product.title || product.name}
      </h3>
      
      <p className="text-gray-600 text-sm mb-4">
        {product.description}
      </p>

      <div className="flex justify-between items-center mb-4">
        <span className="text-xl font-bold text-gray-800">{product.price}</span>
        <div className="flex gap-2">
          {['S', 'M', 'L', 'XL'].map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`w-8 h-8 rounded-full text-sm ${
                selectedSize === size
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
      >
        Add to Cart
      </button>
    </div>
  );
} 