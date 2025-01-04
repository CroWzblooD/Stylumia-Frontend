'use client';
import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
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
import Image from 'next/image';
import dynamic from 'next/dynamic';

const ModelViewer = dynamic(() => import('../ModelViewer'), { ssr: false });

// Simple 3D Model Component
function BodyModel() {
  return (
    <mesh rotation={[0, Math.PI / 4, 0]}>
      <group position={[0, -1, 0]}>
        {/* Body */}
        <mesh position={[0, 1.2, 0]}>
          <capsuleGeometry args={[0.3, 1, 8, 16]} />
          <meshPhongMaterial color="#FFE5D9" />
        </mesh>

        {/* Head */}
        <mesh position={[0, 2.1, 0]}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshPhongMaterial color="#FFE5D9" />
        </mesh>

        {/* Arms */}
        <mesh position={[-0.4, 1.4, 0]}>
          <capsuleGeometry args={[0.08, 0.8, 8, 16]} rotation={[0, 0, -Math.PI / 6]} />
          <meshPhongMaterial color="#FFE5D9" />
        </mesh>
        <mesh position={[0.4, 1.4, 0]}>
          <capsuleGeometry args={[0.08, 0.8, 8, 16]} rotation={[0, 0, Math.PI / 6]} />
          <meshPhongMaterial color="#FFE5D9" />
        </mesh>

        {/* Legs */}
        <mesh position={[-0.15, 0.4, 0]}>
          <capsuleGeometry args={[0.12, 0.8, 8, 16]} />
          <meshPhongMaterial color="#FFE5D9" />
        </mesh>
        <mesh position={[0.15, 0.4, 0]}>
          <capsuleGeometry args={[0.12, 0.8, 8, 16]} />
          <meshPhongMaterial color="#FFE5D9" />
        </mesh>

        {/* Dress/Clothing */}
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.35, 0.45, 1.2, 16]} />
          <meshPhongMaterial color="#FF8FB1" transparent opacity={0.8} />
        </mesh>
      </group>
    </mesh>
  );
}

// 3D Scene Component
function Scene() {
  return (
    <Canvas style={{ background: '#f8fafc' }}>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={null}>
        <BodyModel />
      </Suspense>
      <OrbitControls 
        enableZoom={false}
        minPolarAngle={Math.PI/2}
        maxPolarAngle={Math.PI/2}
      />
    </Canvas>
  );
}

const AvatarEditor = ({ onClose, onSave }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'avatar') {
        const avatarUrl = event.data.url.replace('.glb', '.glb');
        console.log('Avatar URL:', avatarUrl); // For debugging
        onSave(avatarUrl);
        onClose();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSave, onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-[90vw] h-[90vh] overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg"
        >
          <HiOutlineX className="w-6 h-6 text-gray-600" />
        </button>
        <iframe
          ref={iframeRef}
          src="https://demo.readyplayer.me/avatar?frameApi"
          className="w-full h-full"
          allow="camera *; microphone *"
        />
      </div>
    </div>
  );
};

const AvatarViewer = ({ avatarUrl, onEdit }) => {
  console.log('Current Avatar URL:', avatarUrl); // For debugging

  if (!avatarUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#FFE5D9] to-white">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-[#FF8FB1] flex items-center justify-center">
            <HiOutlineUser className="w-16 h-16 text-white" />
          </div>
          <button 
            onClick={onEdit}
            className="px-6 py-2 bg-[#FF8FB1] text-white rounded-full hover:bg-[#FF8FB1]/90 transition-colors"
          >
            Create Avatar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <ModelViewer 
        src={avatarUrl} 
        className="w-full h-full bg-white rounded-lg"
      />
      <div className="absolute top-4 right-4">
        <button 
          onClick={onEdit}
          className="px-4 py-2 bg-[#FF8FB1] text-white rounded-full text-sm hover:bg-[#FF8FB1]/90 transition-colors"
        >
          Edit Avatar
        </button>
      </div>
    </div>
  );
};

const UserStylePanel = () => {
  const [styleData] = useState({
    user: {
      name: 'Emma Watson',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      level: 'Fashion Explorer',
      styleScore: 85,
      totalTryOns: 45,
      savedItems: 28,
      followers: 1.2,
      following: 365,
      measurements: {
        height: "5'7\"",
        weight: "130 lbs",
        sizes: { 
          top: 'M', 
          bottom: '8',
          dress: '6', 
          shoes: '7.5' 
        }
      }
    },
    stats: {
      styleProgress: 78,
      matchAccuracy: 92,
      outfitsSaved: 34,
      trending: 15
    },
    preferences: {
      colors: ['Navy', 'Burgundy', 'Cream', 'Forest Green', 'Black', 'Blush Pink'],
      styles: ['Modern Minimal', 'Classic Chic', 'Business Casual', 'Smart Casual'],
      brands: ['Zara', 'H&M', 'Uniqlo', 'Mango']
    },
    recentOutfits: [
      {
        id: 1,
        name: 'Summer Breeze Outfit',
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8',
        match: 98,
        date: '2 days ago',
        likes: 234
      },
      {
        id: 2,
        name: 'Office Power Look',
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea',
        match: 95,
        date: '3 days ago',
        likes: 186
      }
    ],
    activity: [
      {
        id: 1,
        type: 'try-on',
        item: 'Floral Summer Dress',
        time: '2 hours ago'
      },
      {
        id: 2,
        type: 'save',
        item: 'Classic Blazer',
        time: '5 hours ago'
      }
    ]
  });

  const [isAvatarLoaded, setIsAvatarLoaded] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);

  // Load saved avatar URL from localStorage on mount
  useEffect(() => {
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
      setAvatarUrl(savedAvatar);
    }
  }, []);

  const handleSaveAvatar = (url) => {
    console.log('Saving avatar URL:', url); // For debugging
    setAvatarUrl(url);
    localStorage.setItem('userAvatar', url);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Profile Header */}
      <div className="relative bg-gradient-to-r from-[#FF8FB1] to-[#FCE2DB] p-8">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
              <Image
                src={styleData.user.avatar}
                alt={styleData.user.name}
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
              <h2 className="text-2xl font-bold text-white">{styleData.user.name}</h2>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm">
                {styleData.user.level}
              </span>
            </div>
            
            <div className="mt-3 flex items-center gap-4 text-white/90">
              <span className="text-sm">{styleData.user.followers}K followers</span>
              <span className="text-sm">{styleData.user.following} following</span>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/90 text-sm">Style Score</span>
                <span className="text-white font-medium">{styleData.stats.styleProgress}%</span>
              </div>
              <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white"
                  style={{ width: `${styleData.stats.styleProgress}%` }}
                />
              </div>
            </div>
          </div>
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
              <p className="text-2xl font-bold text-gray-800">{styleData.user.totalTryOns}</p>
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
              <p className="text-2xl font-bold text-gray-800">{styleData.stats.outfitsSaved}</p>
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
              <p className="text-2xl font-bold text-gray-800">{styleData.stats.matchAccuracy}%</p>
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
              <p className="text-2xl font-bold text-gray-800">{styleData.stats.trending}</p>
              <p className="text-sm text-gray-500">Trending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Style Preferences & Avatar */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Style Preferences */}
          <div className="bg-gray-50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <HiOutlineColorSwatch className="w-5 h-5 text-[#FF8FB1]" />
              <h3 className="font-semibold text-gray-700">Style Preferences</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Favorite Colors</p>
                <div className="flex flex-wrap gap-2">
                  {styleData.preferences.colors.map((color, index) => (
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
                  {styleData.preferences.styles.map((style, index) => (
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
                  {styleData.preferences.brands.map((brand, index) => (
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
                <h3 className="font-semibold text-gray-700">Virtual Avatar</h3>
              </div>
            </div>
            <div className="h-[400px] rounded-lg overflow-hidden bg-white">
              <AvatarViewer 
                avatarUrl={avatarUrl} 
                onEdit={() => setShowEditor(true)} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Editor Modal */}
      {showEditor && (
        <AvatarEditor
          onClose={() => setShowEditor(false)}
          onSave={handleSaveAvatar}
        />
      )}

      {/* Recent Outfits */}
      <div className="p-6 border-t border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HiOutlineCamera className="w-5 h-5 text-[#FF8FB1]" />
            <h3 className="font-semibold text-gray-700">Recent Outfits</h3>
          </div>
          <button className="text-sm text-[#FF8FB1] hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {styleData.recentOutfits.map((outfit) => (
            <div
              key={outfit.id}
              className="group relative rounded-xl overflow-hidden bg-gray-50"
            >
              <div className="relative h-64">
                <Image
                  src={outfit.image}
                  alt={outfit.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h4 className="font-medium text-lg">{outfit.name}</h4>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <HiOutlineHeart className="w-4 h-4" />
                    <span className="text-sm">{outfit.likes}</span>
                  </div>
                  <span className="px-2 py-1 bg-green-500/20 rounded-full text-sm backdrop-blur-sm">
                    {outfit.match}% Match
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserStylePanel; 