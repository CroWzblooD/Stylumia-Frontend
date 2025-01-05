import "@/styles/globals.css";
import { CartProvider } from '@/context/CartContext';
import { ClerkProvider } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { TabProvider } from '../context/TabContext';

export default function App({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration issues by not rendering until client-side
  if (!mounted) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <TabProvider>
        <CartProvider>
          <Component {...pageProps} />
        </CartProvider>
      </TabProvider>
    </ClerkProvider>
  );
}
