'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineHeart, HiOutlineShoppingBag, HiOutlineBell } from 'react-icons/hi';
import Image from 'next/image';

const SavedItemsPanel = () => {
  const [savedItems, setSavedItems] = useState([]);
  const [priceAlerts, setPriceAlerts] = useState(0);

  const fashionItems = [
    {
      name: 'Floral Maxi Dress',
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446',
      price: 129.99,
      originalPrice: 159.99,
      discount: 20,
      category: 'Dresses'
    },
    {
      name: 'Denim Jacket',
      image: 'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d',
      price: 89.99,
      originalPrice: 119.99,
      discount: 25,
      category: 'Outerwear'
    },
    {
      name: 'Silk Blouse',
      image: 'https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6',
      price: 79.99,
      originalPrice: 99.99,
      discount: 20,
      category: 'Tops'
    },
    {
      name: 'Leather Boots',
      image: 'https://images.unsplash.com/photo-1542280756-74b2f55e73ab',
      price: 149.99,
      originalPrice: 199.99,
      discount: 25,
      category: 'Shoes'
    },
    {
      name: 'Summer Hat',
      image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee',
      price: 39.99,
      originalPrice: 49.99,
      discount: 20,
      category: 'Accessories'
    }
  ];

  useEffect(() => {
    // Initial data
    const initialItems = fashionItems.slice(0, 4);
    setSavedItems(initialItems);
    setPriceAlerts(Math.floor(Math.random() * 3) + 1);

    // Randomly update prices and alerts every 10 seconds
    const interval = setInterval(() => {
      setSavedItems(prev => prev.map(item => ({
        ...item,
        price: +(item.originalPrice * (0.7 + Math.random() * 0.2)).toFixed(2)
      })));
      setPriceAlerts(Math.floor(Math.random() * 3) + 1);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Saved Items</h2>
          <p className="text-sm text-gray-500">{savedItems.length} items in your wishlist</p>
        </div>
        {priceAlerts > 0 && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-fashion-pink/10 text-fashion-pink rounded-full"
          >
            <HiOutlineBell className="animate-bounce" />
            <span className="text-sm font-medium">{priceAlerts} Price Drops</span>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {savedItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            <div className="relative h-48 w-full">
              <Image
                src={item.image}
                alt={item.name}
                layout="fill"
                objectFit="cover"
                className="group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute top-2 right-2 flex gap-2">
                <button className="p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors">
                  <HiOutlineHeart className="w-4 h-4 text-fashion-pink" />
                </button>
                <button className="p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors">
                  <HiOutlineShoppingBag className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-sm mb-1">{item.name}</h3>
                  <span className="text-xs text-gray-200">{item.category}</span>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold">${item.price}</span>
                    {item.price < item.originalPrice && (
                      <span className="text-xs line-through text-gray-300">
                        ${item.originalPrice}
                      </span>
                    )}
                  </div>
                  {item.price < item.originalPrice && (
                    <span className="text-xs text-green-400">
                      Save {Math.round((1 - item.price/item.originalPrice) * 100)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-6 py-2.5 px-4 bg-gradient-to-r from-fashion-pink to-fashion-orange text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
      >
        View All Saved Items
      </motion.button>
    </div>
  );
};

export default SavedItemsPanel; 