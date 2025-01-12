import { motion } from 'framer-motion';
import { HiStar, HiOutlineShoppingCart, HiHeart, HiShare } from 'react-icons/hi';

export const ProductGrid = ({ products }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {/* Product Image */}
          <div className="aspect-square relative overflow-hidden">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
            {product.discount > 0 && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                -{product.discount}%
              </div>
            )}
            {product.isPrime && (
              <div className="absolute top-2 right-2">
                <img src="/prime-badge.png" alt="Prime" className="h-6" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
              {product.title}
            </h3>
            
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-[#FF6B4A]">
                  ${product.price}
                </span>
                {product.discount > 0 && (
                  <span className="text-sm text-gray-500 line-through">
                    ${(product.price / (1 - product.discount / 100)).toFixed(2)}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                <HiStar className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-600">{product.rating}</span>
                <span className="text-xs text-gray-500">({product.reviews})</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <button className="px-4 py-2 bg-[#FF6B4A] text-white rounded-full text-sm font-medium hover:bg-[#FF6B4A]/90 transition-colors flex items-center gap-2">
                <HiOutlineShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
              
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <HiHeart className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <HiShare className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0"
          />
        </motion.div>
      ))}
    </div>
  );
}; 