'use client';
import { useState, useEffect } from 'react';
import { loadModels, analyzeClothing } from '../services/deepImageAnalysis';
import { motion } from 'framer-motion';
import tinycolor from 'tinycolor2';

export default function FashionAnalyticsContent() {
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState(null);
  const [loadingStates, setLoadingStates] = useState({
    modelLoading: 0,
    imageProcessing: 0,
    colorAnalysis: 0,
    featureExtraction: 0
  });

  useEffect(() => {
    initializeModels();
  }, []);

  const initializeModels = async () => {
    try {
      await loadModels();
      setIsModelLoading(false);
    } catch (err) {
      setError('Failed to load AI models. Please refresh the page.');
      setIsModelLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsAnalyzing(true);
      setError(null);
      
      // Create image preview
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);

      // Simulate progressive loading states
      const updateLoadingState = (key, value) => {
        setLoadingStates(prev => ({ ...prev, [key]: value }));
      };

      // Model loading phase
      for (let i = 0; i <= 100; i += 20) {
        await new Promise(resolve => setTimeout(resolve, 200));
        updateLoadingState('modelLoading', i);
      }

      // Image processing phase
      for (let i = 0; i <= 100; i += 15) {
        await new Promise(resolve => setTimeout(resolve, 150));
        updateLoadingState('imageProcessing', i);
      }

      // Color analysis phase
      for (let i = 0; i <= 100; i += 25) {
        await new Promise(resolve => setTimeout(resolve, 180));
        updateLoadingState('colorAnalysis', i);
      }

      // Feature extraction phase
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 120));
        updateLoadingState('featureExtraction', i);
      }

      // Create image element for analysis
      const img = new Image();
      img.src = imageUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Enhanced analysis with better gender detection
      const results = await analyzeClothing(img);
      
      // Enhance the results with better gender classification
      const enhancedResults = {
        ...results,
        garmentInfo: {
          ...results.garmentInfo,
          gender: detectGarmentGender(results.garmentInfo),
          colors: generateEnhancedColorPalette(results.garmentInfo.colors),
          features: enhanceFeatures(results.garmentInfo.features),
        }
      };

      setAnalysisResults(enhancedResults);

    } catch (err) {
      console.error('Analysis error:', err);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setLoadingStates({
        modelLoading: 0,
        imageProcessing: 0,
        colorAnalysis: 0,
        featureExtraction: 0
      });
    }
  };

  const detectGarmentGender = (garmentInfo) => {
    const femaleIndicators = ['dress', 'skirt', 'blouse', 'gown', 'feminine'];
    const features = garmentInfo.features.map(f => f.toLowerCase());
    
    // Check for explicit female indicators
    if (features.some(f => femaleIndicators.some(i => f.includes(i)))) {
      return 'Women';
    }
    
    // Add more sophisticated gender detection logic based on style and cut
    return garmentInfo.style.includes('feminine') ? 'Women' : 'Unisex';
  };

  const generateEnhancedColorPalette = (colors) => {
    const mainColor = colors[0];
    const palette = generateColorPalette(mainColor);
    
    return {
      primary: mainColor,
      palette: palette,
      harmonious: palette.analogous.slice(0, 3),
      accent: palette.complementary
    };
  };

  const enhanceFeatures = (features) => {
    // Add more detailed feature descriptions
    const enhancedFeatures = features.map(feature => {
      const enhancements = {
        'collar': 'Elegant Collar Detail',
        'button': 'Decorative Buttons',
        'sleeve': 'Statement Sleeves',
        // Add more mappings as needed
      };

      return enhancements[feature.toLowerCase()] || feature;
    });

    return [...new Set(enhancedFeatures)]; // Remove duplicates
  };

  const generateColorPalette = (dominantColor) => {
    const color = tinycolor(dominantColor);
    return {
      main: color.toHexString(),
      complementary: color.complement().toHexString(),
      analogous: color.analogous().map(c => c.toHexString()),
      triadic: color.triad().map(c => c.toHexString()),
      monochromatic: color.monochromatic().map(c => c.toHexString())
    };
  };

  const LoadingAnalysis = ({ loadingStates }) => (
    <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
      <div className="space-y-8 max-w-md mx-auto">
        {Object.entries(loadingStates).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <span>{value}%</span>
            </div>
            <motion.div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-fashion-orange to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          </div>
        ))}
        <p className="text-gray-500 mt-4">Analyzing your fashion piece...</p>
      </div>
    </div>
  );

  const ColorPaletteSection = ({ colors }) => (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <h3 className="text-2xl font-semibold mb-6 flex items-center">
        <span className="text-fashion-orange mr-3">🎨</span>
        Color Palette
      </h3>
      <div className="space-y-6">
        <div className="grid grid-cols-5 gap-2">
          {colors.harmonious.map((color, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              className="aspect-square rounded-xl shadow-lg"
              style={{ backgroundColor: color }}
            >
              <div className="opacity-0 hover:opacity-100 transition-opacity p-2 text-white text-xs">
                {color}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">Primary</div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-20 h-20 rounded-full shadow-lg"
            style={{ backgroundColor: colors.primary }}
          />
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">Accent</div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-16 h-16 rounded-full shadow-lg"
            style={{ backgroundColor: colors.accent }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-fashion-orange to-pink-600 bg-clip-text text-transparent mb-6">
            AI Fashion Analysis
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Upload your fashion piece and let our AI analyze its details
          </p>
        </div>

        {/* Main Content - Single Column Layout */}
        <div className="space-y-8">
          {/* Upload and Preview Section */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-pink-100">
            {!selectedImage ? (
              <div className="p-16">
                <div className="relative border-3 border-dashed border-pink-200 rounded-2xl p-12 hover:bg-gradient-to-br from-pink-50 to-purple-50 transition-all duration-300">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label htmlFor="imageUpload" className="cursor-pointer block text-center">
                    <div className="mb-6">
                      <span className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mx-auto shadow-lg">
                        <span className="text-5xl">📸</span>
                      </span>
                    </div>
                    <h3 className="text-2xl font-semibold text-fashion-orange mb-3">
                      Drop your image here
                    </h3>
                    <p className="text-sm text-gray-500">
                      or click to browse from your device
                    </p>
                  </label>
                </div>
              </div>
            ) : (
              <div className="relative h-[600px] bg-gradient-to-br from-gray-50 to-pink-50 p-6">
                <img
                  src={selectedImage}
                  alt="Selected garment"
                  className="w-full h-full object-contain rounded-xl shadow-lg"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-8 right-8 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  <span className="text-2xl">✕</span>
                </button>
              </div>
            )}
          </div>

          {/* Analysis Results Section */}
          {isAnalyzing ? (
            <LoadingAnalysis loadingStates={loadingStates} />
          ) : analysisResults ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Quick Stats */}
              <div className="bg-white rounded-3xl shadow-xl p-8 lg:col-span-2">
                <h3 className="text-2xl font-semibold mb-6 flex items-center">
                  <span className="text-fashion-orange mr-3">📊</span>
                  Quick Analysis
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {[
                    ['Category', analysisResults.garmentInfo.category, '🏷️'],
                    ['Style', analysisResults.garmentInfo.style, '💫'],
                    ['Gender', analysisResults.garmentInfo.gender, '👤'],
                    ['Material', analysisResults.garmentInfo.material, '🧵'],
                    ['Pattern', analysisResults.garmentInfo.pattern, '🎨'],
                    ['Season', analysisResults.garmentInfo.season, '🌤️']
                  ].map(([label, value, icon]) => (
                    <div key={label} className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span>{icon}</span>
                        <span className="text-sm text-gray-500">{label}</span>
                      </div>
                      <p className="font-semibold text-gray-800 capitalize">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Palette */}
              <ColorPaletteSection colors={analysisResults.garmentInfo.colors} />

              {/* Features */}
              <div className="bg-white rounded-3xl shadow-xl p-8 lg:col-span-2">
                <h3 className="text-2xl font-semibold mb-6 flex items-center">
                  <span className="text-fashion-orange mr-3">✨</span>
                  Features Detected
                </h3>
                <div className="flex flex-wrap gap-3">
                  {analysisResults.garmentInfo.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-6 py-3 bg-gradient-to-r from-pink-50 to-purple-50 text-fashion-orange rounded-full text-sm font-medium hover:shadow-md transition-all hover:scale-105"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Style Recommendations */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h3 className="text-2xl font-semibold mb-6 flex items-center">
                  <span className="text-fashion-orange mr-3">💡</span>
                  Style Tips
                </h3>
                <ul className="space-y-4">
                  {analysisResults.garmentInfo.recommendations?.map((rec, index) => (
                    <li key={index} className="flex items-start p-3 rounded-xl hover:bg-pink-50 transition-all">
                      <span className="text-fashion-orange mr-3">•</span>
                      <p className="text-gray-600">{rec}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-red-600 flex items-center">
              <span className="text-2xl mr-4">⚠️</span>
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 