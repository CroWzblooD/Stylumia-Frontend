'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { 
  HiOutlineUser, 
  HiOutlineCamera, 
  HiOutlineHeart,
  HiOutlineColorSwatch,
  HiOutlineFire,
  HiOutlineTrendingUp,
  HiOutlineX
} from 'react-icons/hi';
import { BsStars } from 'react-icons/bs';

export default function ProfilePage() {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    username: '',
    followers: '1.2K',
    following: '365',
    level: 'Fashion Explorer',
    stats: {
      styleProgress: 78,
      matchAccuracy: 92,
      outfitsSaved: 34,
      trending: 15,
      tryOns: 45
    },
    preferences: {
      colors: ['Navy', 'Burgundy', 'Cream', 'Forest Green', 'Black'],
      styles: ['Modern Minimal', 'Classic Chic', 'Business Casual'],
      brands: ['Zara', 'H&M', 'Uniqlo', 'Mango'],
      size: '',
      style: ''
    }
  });

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        fullName: user.fullName || '',
        username: user.username || '',
      }));
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      await user.update({
        username: profileData.username,
      });

      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Profile Header */}
      <div className="relative bg-gradient-to-r from-[#FF8FB1] to-[#FCE2DB] p-8">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
              <Image
                src={user?.imageUrl || '/default-avatar.png'}
                alt="Profile"
                width={112}
                height={112}
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-3 -right-3 p-2 bg-white rounded-lg shadow-lg">
              <BsStars className="w-5 h-5 text-[#FF8FB1]" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3">
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                  className="text-2xl font-bold text-white bg-white/20 rounded px-2"
                />
              ) : (
                <h2 className="text-2xl font-bold text-white">{profileData.fullName}</h2>
              )}
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm">
                {profileData.level}
              </span>
            </div>
            
            <div className="mt-3 flex items-center gap-4 text-white/90">
              <span className="text-sm">{profileData.followers} followers</span>
              <span className="text-sm">{profileData.following} following</span>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/90 text-sm">Style Score</span>
                <span className="text-white font-medium">{profileData.stats.styleProgress}%</span>
              </div>
              <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white"
                  style={{ width: `${profileData.stats.styleProgress}%` }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={isSaving}
            className={`px-4 py-2 ${
              isEditing ? 'bg-white text-[#FF8FB1]' : 'bg-white/20 text-white'
            } rounded-lg transition-colors`}
          >
            {isEditing ? (isSaving ? 'Saving...' : 'Save Changes') : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 p-6 bg-gray-50">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <HiOutlineCamera className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{profileData.stats.tryOns}</p>
              <p className="text-sm text-gray-500">Try-ons</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <HiOutlineHeart className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{profileData.stats.outfitsSaved}</p>
              <p className="text-sm text-gray-500">Saved</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <HiOutlineFire className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{profileData.stats.matchAccuracy}%</p>
              <p className="text-sm text-gray-500">Match Rate</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <HiOutlineTrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{profileData.stats.trending}</p>
              <p className="text-sm text-gray-500">Trending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Style Preferences */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <HiOutlineColorSwatch className="w-5 h-5 text-[#FF8FB1]" />
              <h3 className="font-semibold text-gray-700">Style Preferences</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Favorite Colors</p>
                <div className="flex flex-wrap gap-2">
                  {profileData.preferences.colors.map((color, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 shadow-sm"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Style Categories</p>
                <div className="flex flex-wrap gap-2">
                  {profileData.preferences.styles.map((style, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#FF8FB1]/10 text-[#FF8FB1] rounded-full text-sm"
                    >
                      {style}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Favorite Brands</p>
                <div className="flex flex-wrap gap-2">
                  {profileData.preferences.brands.map((brand, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Avatar Section */}
          <div className="bg-gray-50 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <HiOutlineUser className="w-5 h-5 text-[#FF8FB1]" />
                <h3 className="font-semibold text-gray-700">Personal Information</h3>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="text-gray-700">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Username</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.username}
                    onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                    className="w-full border-b border-gray-200 focus:border-[#FF8FB1] outline-none"
                  />
                ) : (
                  <p className="text-gray-700">@{profileData.username}</p>
                )}
              </div>
              {/* Add more personal information fields as needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 