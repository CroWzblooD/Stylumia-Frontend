'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaChrome, FaDownload, FaCode, FaPuzzlePiece } from 'react-icons/fa';

export default function TryOnContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF0F3] to-white">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-6 py-2 rounded-full bg-[#FFB5C2]/20 text-[#FF8FA3] mb-6">
              ✨ Revolutionary Virtual Try-On Extension
            </span>
            <h1 className="text-6xl md:text-7xl font-playfair font-bold mb-6 bg-gradient-to-r from-[#FF8FA3] to-[#FF6B35] text-transparent bg-clip-text">
              Try On Any Clothing
              <br />
              From Any Website 🛍️
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
              Transform your online shopping experience with our AI-powered virtual fitting room extension
            </p>

            {/* Demo Preview */}
            <div className="relative max-w-4xl mx-auto mb-20">
              <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070"
                  alt="Virtual Try-On Demo"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent">
                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <h3 className="text-2xl font-bold mb-2">Virtual Try-On Magic ✨</h3>
                    <p className="text-lg opacity-90">Experience clothes before you buy them</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Features */}
              <div className="absolute -right-4 top-1/3 transform translate-x-1/2">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white p-4 rounded-xl shadow-lg mb-4"
                >
                  🎯 95% Size Accuracy
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white p-4 rounded-xl shadow-lg"
                >
                  ⚡ Instant Results
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
            {[
              { number: "100+", label: "Supported Stores 🏪" },
              { number: "50K+", label: "Happy Users 😊" },
              { number: "95%", label: "Size Accuracy 📏" },
              { number: "24/7", label: "AI Support 🤖" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="p-6 bg-white rounded-xl shadow-lg text-center"
              >
                <div className="text-3xl font-bold text-[#FF8FA3] mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Extension Setup Guide */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12">
              Quick Setup Guide 🛠️
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Setup Steps */}
              <div className="space-y-6">
                {[
                  {
                    icon: <FaDownload className="text-2xl" />,
                    emoji: "📦",
                    title: "1. Download Extension ZIP",
                    description: "Get our extension package from the download button below"
                  },
                  {
                    icon: <FaChrome className="text-2xl" />,
                    emoji: "🌐",
                    title: "2. Open Chrome Extensions",
                    description: "Navigate to chrome://extensions/ in your browser"
                  },
                  {
                    icon: <FaPuzzlePiece className="text-2xl" />,
                    emoji: "🔧",
                    title: "3. Enable Developer Mode",
                    description: "Toggle 'Developer mode' switch in the top right corner"
                  },
                  {
                    icon: <FaCode className="text-2xl" />,
                    emoji: "🚀",
                    title: "4. Load Unpacked",
                    description: "Click 'Load unpacked' and select the extracted extension folder"
                  }
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 10 }}
                    className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-lg border border-[#FFB5C2]/20"
                  >
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-[#FFB5C2]/20 text-[#FF8FA3]">
                      {step.emoji}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </motion.div>
                ))}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-4 bg-[#FF8FA3] text-white rounded-xl font-semibold shadow-lg hover:bg-[#FF6B35] transition-all"
                >
                  Download Extension ZIP 📦
                </motion.button>
              </div>

              {/* How to Use */}
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-[#FFB5C2]/20">
                <h3 className="text-2xl font-bold mb-6">How to Use 🎯</h3>
                <div className="space-y-6">
                  {[
                    {
                      emoji: "📸",
                      title: "Upload Your Photo",
                      description: "Take a full-body photo or upload one through the extension"
                    },
                    {
                      emoji: "👕",
                      title: "Browse & Select",
                      description: "Visit any clothing website and click on items you want to try"
                    },
                    {
                      emoji: "✨",
                      title: "Instant Virtual Try-On",
                      description: "See yourself wearing the selected items in real-time"
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-[#FFB5C2]/20 text-2xl">
                        {item.emoji}
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{item.title}</h4>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Preview Image */}
                <div className="mt-8 relative h-48 rounded-xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070"
                    alt="Extension Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Features & Compatibility */}
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-12">
              Supported Features & Sites ✨
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Compatible Websites 🏪",
                  items: ["Amazon Fashion", "ASOS", "Zara", "H&M", "Nike", "And more..."]
                },
                {
                  title: "Supported Clothing 👕",
                  items: ["T-shirts", "Dresses", "Pants", "Jackets", "Shoes", "Accessories"]
                },
                {
                  title: "Key Features 🎯",
                  items: ["Real-time Try-On", "Size Prediction", "Style Matching", "Photo Sharing"]
                }
              ].map((section, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="p-6 bg-white rounded-xl shadow-lg border border-[#FFB5C2]/20"
                >
                  <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="text-gray-600">• {item}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="text-center bg-gradient-to-r from-[#FFB5C2]/20 to-white p-12 rounded-3xl shadow-lg"
          >
            <h2 className="text-3xl font-bold mb-6">
              Ready to Transform Your Shopping? 🛍️
            </h2>
            <p className="text-gray-600 mb-8">
              Join thousands of happy shoppers who never buy ill-fitting clothes again
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-[#FF8FA3] text-white rounded-xl font-semibold shadow-lg hover:bg-[#FF6B35] transition-all"
            >
              Get Started Now ✨
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}