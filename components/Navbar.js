'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useTab } from '../context/TabContext';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Settings, 
  LogOut,
  ShoppingBag,
  User
} from 'lucide-react';
import { 
  SignInButton, 
  SignUpButton,
  useUser,
  useClerk
} from '@clerk/nextjs';

export default function Navbar() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const { setActiveTab } = useTab();

  const handleSignOut = () => {
    signOut();
    setIsUserMenuOpen(false);
  };

  const handleProfileClick = () => {
    setActiveTab('profile');
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="h-16 bg-white/90 backdrop-blur-md border-b border-gray-100 fixed top-0 left-0 w-full z-50">
      <div className="max-w-[1400px] mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-marcellus font-bold gradient-text">
            OutWear
          </Link>
          
          <div className="hidden md:flex items-center gap-10 ml-20">
            <Link href="/explore" className="nav-link">Explore</Link>
            <Link href="/trending" className="nav-link">Trending</Link>
            <Link href="/collections" className="nav-link">Collections</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="icon-btn">
            <Search className="w-5 h-5" />
          </button>
          
          {isSignedIn ? (
            <>
              <button className="icon-btn relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-fashion-orange text-white text-xs rounded-full flex items-center justify-center">
                  2
                </span>
              </button>

              <button className="icon-btn">
                <ShoppingBag className="w-5 h-5" />
              </button>

              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100"
                >
                  <img 
                    src={user?.imageUrl || '/default-avatar.png'} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100">
                    <button 
                      onClick={handleProfileClick}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 w-full"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </button>
                    <button 
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <SignInButton mode="modal">
                <button className="text-gray-700 hover:text-fashion-orange px-4 py-2 rounded-lg transition-colors">
                  Sign In
                </button>
              </SignInButton>
              
              <SignUpButton mode="modal">
                <button className="gradient-button">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}