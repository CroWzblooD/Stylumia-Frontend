'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {  FiUpload } from 'react-icons/fi';
import { HiOutlineChartBar, HiOutlineStar, HiOutlineLightBulb, HiOutlineTrendingUp } from 'react-icons/hi';
import { getRandomFashionImages } from './fashionImages';

// Define constants at the top level
const tabTitles = {
  trending: "What's Trending",
  popular: "Popular Trends",
  influencer: "Influencer Picks",
  future: "Future Spotlight",
  similar: "Analysis Results"
};

const defaultTrends = {
  trending: [
    {
      title: "Summer Collection",
      growth: "+15.5",
      images: [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
        'https://images.unsplash.com/photo-1554568218-0f1715e72254',
        'https://images.unsplash.com/photo-1622445275576-721325763afe',
        'https://images.unsplash.com/photo-1483721310020-03333e577078'
      ],
      description: "Latest summer trends"
    },
    {
      title: "Casual Wear",
      growth: "+12.3",
      images: [
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
        'https://images.unsplash.com/photo-1509631179647-0177331693ae',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9',
        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b'
      ],
      description: "Everyday comfort styles"
    }
  ],
  popular: [
    {
      title: "Street Style",
      growth: "+18.2",
      images: [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
        'https://images.unsplash.com/photo-1554568218-0f1715e72254',
        'https://images.unsplash.com/photo-1622445275576-721325763afe',
        'https://images.unsplash.com/photo-1483721310020-03333e577078'
      ],
      description: "Urban fashion trends"
    }
  ],
  influencer: [
    {
      title: "Celebrity Picks",
      growth: "+20.1",
      images: [
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
        'https://images.unsplash.com/photo-1509631179647-0177331693ae',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9',
        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b'
      ],
      description: "Influencer favorites"
    }
  ],
  future: [
    {
      title: "Upcoming Styles",
      growth: "+25.4",
      images: [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
        'https://images.unsplash.com/photo-1554568218-0f1715e72254',
        'https://images.unsplash.com/photo-1622445275576-721325763afe',
        'https://images.unsplash.com/photo-1483721310020-03333e577078'
      ],
      description: "Future fashion predictions"
    }
  ]
};

const SideNavItem = ({ icon: Icon, title, subtitle, isActive }) => (
  <div className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
    isActive ? 'bg-pink-50' : 'hover:bg-gray-50'
  }`}>
    <div className={`p-3 rounded-lg ${isActive ? 'bg-[var(--primary-pink)]' : 'bg-gray-100'}`}>
      <Icon className={`text-xl ${isActive ? 'text-white' : 'text-gray-600'}`} />
    </div>
    <div>
      <h3 className="font-medium text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  </div>
);

const TrendCard = ({ images, title, growth, description }) => {
  const isPositiveGrowth = parseFloat(growth) > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl overflow-hidden"
    >
      <div className="grid grid-cols-2 gap-2 p-3">
        {images.map((img, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="relative aspect-square rounded-lg overflow-hidden"
          >
            <img
              src={img}
              alt={`${title} trend ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-[var(--deep-pink)]">{title}</h3>
          <div className={`px-3 py-1 rounded-full text-sm ${
            isPositiveGrowth ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
          }`}>
            MoM {growth}%{isPositiveGrowth ? '↑' : '↓'}
          </div>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
};

// Add new component for image upload and analysis
const ImageAnalyzer = ({ onAnalysisComplete }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage({
          preview: URL.createObjectURL(file),
          base64: reader.result.split(',')[1]
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClosePreview = () => {
    if (selectedImage?.preview) {
      URL.revokeObjectURL(selectedImage.preview);
    }
    setSelectedImage(null);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Filter images based on tags
    const filteredImages = searchFashionImages(e.target.value);
    if (filteredImages.length > 0) {
      onAnalysisComplete({
        similar: [
          {
            title: "Search Results",
            growth: "",
            images: filteredImages,
            description: `Results for "${e.target.value}"`
          }
        ]
      });
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    try {
      const randomImages = getRandomFashionImages(12);
      const results = {
        similar: [
          {
            title: "Similar Style 1",
            growth: "12.5",
            images: randomImages.slice(0, 4),
            description: "Similar styles based on your upload"
          },
          {
            title: "Similar Style 2",
            growth: "8.3",
            images: randomImages.slice(4, 8),
            description: "More matching styles for your look"
          }
        ]
      };
      
      onAnalysisComplete(results);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex gap-8 items-start mb-8">
      <div className="flex-1 relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search via text (e.g., tshirt, red, formal)"
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl"
        />
      </div>

      <div className="flex flex-col items-center gap-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current.click()}
          className="px-6 py-3 border-2 border-black rounded-xl hover:bg-gray-50"
        >
          <FiUpload className="mr-2 inline-block" />
          Upload Image
        </button>

        {selectedImage && (
          <div className="space-y-4">
            <div className="relative w-[300px] h-[300px] rounded-xl overflow-hidden bg-gray-100">
              <button
                onClick={handleClosePreview}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={selectedImage.preview}
                alt="Uploaded fashion item"
                className="w-full h-full object-contain"
              />
            </div>
            <button
              onClick={analyzeImage}
              disabled={isAnalyzing}
              className="w-full px-6 py-3 bg-[#FF7A00] text-white rounded-xl hover:bg-opacity-90 disabled:opacity-50"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Fashion'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const fashionCategories = {
  tshirt: {
    title: "T-Shirts",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27",
      // ... add more t-shirt images (20 total)
    ]
  },
  dress: {
    title: "Dresses",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1",
      "https://images.unsplash.com/photo-1612336307429-8a898d10e223",
      // ... add more dress images (20 total)
    ]
  },
  formal: {
    title: "Formal Wear",
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
      "https://images.unsplash.com/photo-1598808503746-f34c53b9323e",
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc",
      // ... add more formal wear images (20 total)
    ]
  },
  casual: {
    title: "Casual Wear",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
      "https://images.unsplash.com/photo-1554568218-0f1715e72254",
      "https://images.unsplash.com/photo-1622445275576-721325763afe",
      // ... add more casual wear images (20 total)
    ]
  },
  // ... add more categories
};

// Helper function to get random images from a category
export const getRandomImages = (category, count = 8) => {
  const images = fashionCategories[category]?.images || [];
  const shuffled = [...images].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to get random images from all categories
export const getRandomFashionImage = (count = 8) => {
  const allImages = Object.values(fashionCategories).flatMap(cat => cat.images);
  const shuffled = [...allImages].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to search categories
export const searchFashionImages = (query) => {
  query = query.toLowerCase();
  for (const [category, data] of Object.entries(fashionCategories)) {
    if (category.includes(query) || data.title.toLowerCase().includes(query)) {
      return getRandomImages(category);
    }
  }
  return getRandomFashionImage();
};

export default function TrendingFashion() {
  const [activeSection, setActiveSection] = useState('trending');
  const [analyzedResults, setAnalyzedResults] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [trends, setTrends] = useState(defaultTrends);

  const handleAnalysisComplete = (results) => {
    setAnalyzedResults(results);
    setActiveSection('similar');
  };

  return (
    <div className="flex gap-8 p-6 bg-gray-50" style={{ marginTop: '50px' }}>
      {/* Left Sidebar */}
      <div className="w-72 flex flex-col gap-4">
        {[
          { id: 'trending', icon: HiOutlineTrendingUp, title: tabTitles.trending, subtitle: "Current fashion trends" },
          { id: 'popular', icon: HiOutlineChartBar, title: tabTitles.popular, subtitle: "Most searched styles" },
          { id: 'influencer', icon: HiOutlineStar, title: tabTitles.influencer, subtitle: "Curated by top influencers" },
          { id: 'future', icon: HiOutlineLightBulb, title: tabTitles.future, subtitle: "Upcoming trend predictions" }
        ].map(item => (
          <div key={item.id} onClick={() => setActiveSection(item.id)}>
            <SideNavItem
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
              isActive={activeSection === item.id}
            />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-[var(--accent-orange)] mb-6">
          {analyzedResults && activeSection === 'similar' 
            ? tabTitles.similar
            : tabTitles[activeSection]}
        </h2>

        <ImageAnalyzer onAnalysisComplete={handleAnalysisComplete} />

        {/* Popup with higher z-index */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-xl p-6 relative w-[500px]">
              <button
                onClick={handleClosePreview}
                className="absolute -top-3 -right-3 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 z-[10000]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="relative w-full h-[300px]">
                <img
                  src={selectedImage.preview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>
              <button
                onClick={analyzeImage}
                disabled={isAnalyzing}
                className="w-full mt-4 px-6 py-3 bg-[#FF7A00] text-white rounded-xl hover:bg-opacity-90 disabled:opacity-50"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Fashion'}
              </button>
            </div>
          </div>
        )}

        {/* Trends Grid */}
        <div className="grid grid-cols-2 gap-8">
          {analyzedResults && activeSection === 'similar'
            ? analyzedResults[activeSection].map((trend, index) => (
                <TrendCard key={index} {...trend} />
              ))
            : trends[activeSection]?.map((trend, index) => (
                <TrendCard key={index} {...trend} />
              ))}
        </div>
      </div>
    </div>
  );
} 