import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";
import ProfilePage from '@/components/Profile/ProfilePage';

export default function Profile() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  // Check if the user is authenticated
  if (!isLoaded) {
    return null; // or a loading spinner
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    router.push('/sign-in');
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <ProfilePage />
    </main>
  );
} 