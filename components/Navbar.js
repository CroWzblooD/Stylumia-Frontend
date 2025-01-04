'use client';
import Link from 'next/link';
import { useState } from 'react';
import { 
  Search, 
  Bell, 
  User, 
  ChevronDown, 
  Settings, 
  LogOut,
  ShoppingBag
} from 'lucide-react';

export default function Navbar() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

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
              className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-fashion-orange to-fashion-deep-pink flex items-center justify-center text-white">
                <User className="w-5 h-5" />
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100">
                <button className="menu-item">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                <button className="menu-item">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <hr className="my-2" />
                <button className="menu-item text-red-600">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

          <button className="gradient-button">
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}