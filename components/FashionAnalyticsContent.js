'use client';
import { useState, useEffect } from 'react';
import { loadModels, analyzeClothing } from '../services/deepImageAnalysis';

export default function FashionAnalyticsContent() {
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState(null);

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

      // Create image element for analysis
      const img = new Image();
      img.src = imageUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const results = await analyzeClothing(img);
      setAnalysisResults(results);

    } catch (err) {
      console.error('Analysis error:', err);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            AI Fashion Analysis
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your garment image and let our AI analyze its style, features, and provide personalized recommendations.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Upload Section */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-pink-100">
              <div className="p-8">
                <div className="relative border-2 border-dashed border-pink-200 rounded-2xl p-8 hover:bg-pink-50/30 transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label htmlFor="imageUpload" className="cursor-pointer block text-center">
                    <div className="mb-4">
                      <span className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center mx-auto">
                        📸
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-fashion-orange mb-2">
                      Click to upload image
                    </h3>
                    <p className="text-sm text-gray-500">
                      or drag and drop your image here
                    </p>
                  </label>
                </div>
              </div>
              
              {/* Image Preview */}
              {selectedImage && (
                <div className="border-t border-pink-100">
                  <div className="relative h-[400px] bg-gray-50">
                    <img
                      src={selectedImage}
                      alt="Selected garment"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Tips for Best Results
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-600">
                  <span className="mr-2">✨</span>
                  Use clear, well-lit photos
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="mr-2">🎯</span>
                  Center the garment in frame
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="mr-2">🖼️</span>
                  Avoid busy backgrounds
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Analysis Results */}
          <div className="space-y-8">
            {isAnalyzing ? (
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fashion-orange mx-auto mb-4"></div>
                <p className="text-gray-600">Analyzing your garment...</p>
              </div>
            ) : analysisResults ? (
              <>
                {/* Garment Details */}
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    Garment Analysis
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      ['Category', analysisResults.garmentInfo.category],
                      ['Style', analysisResults.garmentInfo.style],
                      ['Gender', analysisResults.garmentInfo.gender],
                      ['Material', analysisResults.garmentInfo.material],
                      ['Pattern', analysisResults.garmentInfo.pattern],
                      ['Occasion', analysisResults.garmentInfo.occasion],
                      ['Season', analysisResults.garmentInfo.season]
                    ].map(([label, value]) => (
                      <div key={label} className="space-y-1">
                        <p className="text-sm text-gray-500">{label}</p>
                        <p className="font-medium text-gray-800 capitalize">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    Features Detected
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {analysisResults.garmentInfo.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-pink-50 text-fashion-orange rounded-full text-sm font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    Color Palette
                  </h3>
                  <div className="flex space-x-6">
                    {analysisResults.garmentInfo.colors.map((color, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className="w-20 h-20 rounded-2xl shadow-lg"
                          style={{ backgroundColor: color }}
                        />
                        <p className="text-sm text-gray-500 mt-2">Color {index + 1}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Style Recommendations */}
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    Style Recommendations
                  </h3>
                  <ul className="space-y-4">
                    {analysisResults.garmentInfo.recommendations?.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-fashion-orange mr-3">💡</span>
                        <p className="text-gray-600">{rec}</p>
                      </li>
                    )) || (
                      <li className="text-gray-600">
                        No specific recommendations available for this item.
                      </li>
                    )}
                  </ul>
                </div>
              </>
            ) : null}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-red-600">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 