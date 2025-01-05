'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiTrash2, FiTrendingUp } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';
import { searchFashionImages } from './fashionImages';

const getSimilarFashionItems = async (imageBase64) => {
  try {
    console.log('Starting Azure Vision analysis...');
    const response = await fetch('/api/analyze-fashion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64 })
    });

    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Azure Vision results:', data);

    // Safely extract color and clothing type with better matching
    const dominantColors = data.analysis?.dominantColors || [];
    const tags = data.analysis?.tags || [];
    
    // More specific color matching
    const mainColor = dominantColors.length > 0 
      ? dominantColors[0].toLowerCase().replace(/\s+/g, '')
      : '';

    // More specific clothing type matching
    const clothingTypes = {
      shirt: ['shirt', 'tshirt', 't-shirt', 'top'],
      dress: ['dress', 'gown'],
      jeans: ['jeans', 'denim', 'pants']
    };

    let clothingType = '';
    for (const [type, keywords] of Object.entries(clothingTypes)) {
      if (tags.some(tag => keywords.some(keyword => 
        tag.toLowerCase().includes(keyword)
      ))) {
        clothingType = type;
        break;
      }
    }

    // Construct search query with better specificity
    const searchQuery = `${mainColor} ${clothingType}`.trim();
    console.log('Searching for:', searchQuery);
    
    // Get matching images with exact color and type match
    const matchingImages = searchFashionImages(searchQuery);
    console.log('Found matches:', matchingImages.length);

    // If no exact matches, try broader search
    let finalImages = matchingImages;
    if (matchingImages.length === 0) {
      finalImages = searchFashionImages(clothingType);
    }

    return {
      success: true,
      analysis: {
        style: `${mainColor} ${clothingType}`,
        confidence: 0.95,
        tags: [...new Set([mainColor, clothingType, ...tags])].filter(Boolean),
      },
      results: finalImages
    };
  } catch (error) {
    console.error('Analysis error:', error);
    throw error;
  }
};

const SimilarStyleCard = ({ image, style, confidence, trend }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white rounded-xl shadow-md overflow-hidden group"
  >
    <div className="relative aspect-[3/4]">
      <img
        src={image}
        alt={style}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">{style}</span>
            <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
              {confidence}% Match
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FiTrendingUp className={trend > 0 ? "text-green-400" : "text-red-400"} />
            <span>{trend > 0 ? "+" : ""}{trend}% This Season</span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const StyleGrid = ({ images, analysis }) => {
  const categories = [
    "Casual Wear",
    "Formal Style",
    "Street Fashion",
    "Trendy Look",
    "Classic Style",
    "Modern Fashion"
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images?.map((img, index) => (
          <SimilarStyleCard
            key={index}
            image={img}
            style={categories[index] || "Trending Style"}
            confidence={Math.round((analysis?.confidence || 0.8) * 100 - (index * 5))}
            trend={Math.round(Math.random() * 40 + 10)}
          />
        ))}
      </div>
    </div>
  );
};

const TrendStats = ({ analysis }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    {[
      {
        title: "Style Match",
        value: `${(analysis.confidence * 100).toFixed(1)}%`,
        icon: "🎯"
      },
      {
        title: "Season Trend",
        value: analysis.style,
        icon: "📈"
      },
      {
        title: "Category",
        value: analysis.tags[0] || "Fashion",
        icon: "👔"
      }
    ].map((stat, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white rounded-xl p-4 shadow-md"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{stat.icon}</span>
          <div>
            <p className="text-sm text-gray-500">{stat.title}</p>
            <p className="font-semibold text-gray-800">{stat.value}</p>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

const StyleInsights = ({ analysis }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-md p-6 mb-6"
  >
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Style Insights</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 className="text-sm font-medium text-gray-600 mb-3">Key Elements</h4>
        <div className="flex flex-wrap gap-2">
          {analysis.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-[var(--primary-pink)] text-[var(--deep-pink)] rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-600 mb-3">Season Forecast</h4>
        <div className="space-y-2">
          {analysis.tags.slice(0, 3).map((tag, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{tag}</span>
              <div className="w-32 h-2 bg-[var(--primary-pink)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${90 - (index * 15)}%` }}
                  className="h-full bg-[var(--accent-orange)] rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

const ResultCard = ({ title, confidence, images, analysis }) => (
  <div className="space-y-6">
    <TrendStats analysis={analysis} />
    <StyleInsights analysis={analysis} />
    <StyleGrid images={images} analysis={analysis} />
  </div>
);

const ImageUploader = ({ onAnalysisComplete }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const resetUploader = () => {
    setSelectedImage(null);
    setIsAnalyzing(false);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input
    }
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
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

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    try {
      const response = await getSimilarFashionItems(selectedImage.base64);
      console.log('Analysis completed:', response);
      
      if (response && response.success) {
        onAnalysisComplete({
          similar: [{
            title: `${response.analysis.style.toUpperCase()} Style`,
            confidence: `${(response.analysis.confidence * 100).toFixed(1)}%`,
            images: response.results || [],
            analysis: response.analysis
          }]
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mb-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4">
          {!selectedImage ? (
            <motion.div
              className="border-2 border-dashed border-[var(--primary-pink)] rounded-lg p-8 text-center cursor-pointer hover:border-[var(--accent-orange)] transition-colors"
              onClick={() => fileInputRef.current?.click()}
              whileHover={{ scale: 1.01 }}
            >
              <FiUpload className="mx-auto text-3xl text-[var(--accent-orange)] mb-3" />
              <p className="text-gray-600">Click to upload an image</p>
              <p className="text-sm text-gray-400 mt-2">
                Supports: JPG, PNG (Max 5MB)
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={selectedImage.preview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={resetUploader}
                  className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full hover:bg-white"
                >
                  <FiTrash2 className="text-red-500" />
                </button>
              </div>

              {isAnalyzing && (
                <div className="w-full h-2 bg-[var(--primary-pink)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    className="h-full bg-[var(--accent-orange)]"
                  />
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={analyzeImage}
                disabled={isAnalyzing}
                className="w-full py-2.5 bg-[var(--accent-orange)] text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <HiOutlineSparkles className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Style'
                )}
              </motion.button>
            </div>
          )}
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
};

export default function TrendingFashion() {
  const [analyzedResults, setAnalyzedResults] = useState(null);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          AI Fashion Style Analyzer
        </h2>
        <p className="text-gray-600">
          Upload your fashion image to discover similar styles and trend forecasts
        </p>
      </div>

      <ImageUploader onAnalysisComplete={setAnalyzedResults} />

      {analyzedResults && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {analyzedResults.similar.map((result, index) => (
              <ResultCard key={index} {...result} />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
} 