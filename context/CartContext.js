import { createContext, useState, useEffect, useContext } from 'react';

export const CartContext = createContext();

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }) {
  // Initialize state from localStorage if available
  const [cart, setCart] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });
  
  const [total, setTotal] = useState(0);
  const [carbonSaved, setCarbonSaved] = useState(0);

  // Update localStorage whenever cart changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
      calculateTotal();
      calculateCarbonSaved();
    }
  }, [cart]);

  const calculateTotal = () => {
    const newTotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    setTotal(newTotal);
  };

  const calculateCarbonSaved = () => {
    const saved = cart.reduce((sum, item) => {
      const baseCarbonFootprint = 2.5;
      const ecoSavingFactor = item.sustainabilityScore ? item.sustainabilityScore / 100 : 0.5;
      return sum + (baseCarbonFootprint * ecoSavingFactor * (item.quantity || 1));
    }, 0);
    setCarbonSaved(saved);
  };

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(
        item => item.id === product.id && item.size === product.size
      );

      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id && item.size === product.size
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }

      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId, size) => {
    setCart(prevCart => 
      prevCart.filter(item => !(item.id === productId && item.size === size))
    );
  };

  const updateQuantity = (productId, size, quantity) => {
    if (quantity < 1) return;
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId && item.size === size
          ? { ...item, quantity: quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
    }
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + (item.quantity || 1), 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      total,
      carbonSaved,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
} 