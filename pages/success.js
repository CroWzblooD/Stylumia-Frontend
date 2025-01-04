'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Success() {
  const router = useRouter();
  const { session_id } = router.query;

  useEffect(() => {
    if (session_id) {
      // Clear the cart after successful payment
      localStorage.removeItem('cart');
    }
  }, [session_id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-green-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Thank You for Your Purchase!</h1>
          <p className="text-gray-600 mb-8">
            Your order has been successfully processed. You will receive an email confirmation shortly.
          </p>
          <Link href="/">
            <button className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
} 