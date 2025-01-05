import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { SignIn, useAuth } from "@clerk/nextjs";

export default function SignInPage() {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const { redirect_url } = router.query;

  useEffect(() => {
    if (isLoaded && userId) {
      router.push(redirect_url || '/');
    }
  }, [isLoaded, userId, router, redirect_url]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-fashion-pink to-white">
      <SignIn 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white shadow-xl rounded-xl",
          }
        }}
        redirectUrl={redirect_url || '/'}
      />
    </div>
  );
} 