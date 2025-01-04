'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartJSTooltip,
  Legend as ChartJSLegend
} from 'chart.js';
import Link from 'next/link';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartJSTooltip,
  ChartJSLegend
);

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

const extractProductInfo = (url) => {
  const regex = /\/dp\/(B[A-Z0-9]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const AnalysisSkeleton = () => (
  <div className="animate-pulse">
    {/* Product Details Skeleton */}
    <div className="mb-8 bg-gray-100 rounded-xl p-6">
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    </div>

    {/* Metrics Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-gray-100 rounded-xl p-6">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-2 bg-gray-200 rounded w-full"></div>
        </div>
      ))}
    </div>

    {/* Chart Skeleton */}
    <div className="mt-8">
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="h-[300px] bg-gray-100 rounded-xl"></div>
    </div>
  </div>
);

const formatImageUrl = (url) => {
  if (!url) return null;
  
  // Handle protocol-relative URLs
  if (url.startsWith('//')) {
    return `https:${url}`;
  }
  
  // Handle relative URLs
  if (url.startsWith('/')) {
    // You might need to adjust the base URL depending on the website
    return `https://example.com${url}`;
  }
  
  // Handle invalid URLs
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return null;
  }
  
  return url;
};

const analyzeCarbonImpact = async (scrapedData) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Analyze the environmental impact of this fashion product with these specifications:
      Title: ${scrapedData.title || ''}
      Materials: ${Array.isArray(scrapedData.materials) ? scrapedData.materials.join(', ') : ''}
      Specifications: ${JSON.stringify(scrapedData.specifications || {})}
      
      Provide a detailed analysis with exact numbers for:
      - Manufacturing carbon footprint (in kg CO2)
      - Transport carbon footprint (in kg CO2)
      - Packaging carbon footprint (in kg CO2)
      - Water usage (in liters)
      - Sustainability score (0-100)
      - Three specific recommendations
      
      Return only a valid JSON object in this exact format, no other text:
      {
        "carbonFootprint": {
          "manufacturing": number,
          "transport": number,
          "packaging": number
        },
        "waterUsage": number,
        "sustainabilityScore": number,
        "recommendations": ["string", "string", "string"],
        "impactBreakdown": {
          "materialImpact": "string",
          "productionImpact": "string",
          "transportImpact": "string"
        }
      }`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text()
      .replace(/```json\s*|\s*```/g, '') // Remove code blocks
      .replace(/^[^{]*/, '') // Remove any text before the first {
      .replace(/[^}]*$/, ''); // Remove any text after the last }

    if (!responseText.trim().startsWith('{') || !responseText.trim().endsWith('}')) {
      throw new Error('Invalid JSON structure received');
    }

    let analysis = JSON.parse(responseText);

    // Validate and provide default values if needed
    return {
      carbonFootprint: {
        manufacturing: Number(analysis.carbonFootprint?.manufacturing) || 5.5,
        transport: Number(analysis.carbonFootprint?.transport) || 2.3,
        packaging: Number(analysis.carbonFootprint?.packaging) || 1.2
      },
      waterUsage: Number(analysis.waterUsage) || 2000,
      sustainabilityScore: Number(analysis.sustainabilityScore) || 50,
      recommendations: Array.isArray(analysis.recommendations) ? 
        analysis.recommendations.slice(0, 3) : 
        ["Use eco-friendly materials", "Optimize packaging", "Choose local suppliers"],
      impactBreakdown: {
        materialImpact: String(analysis.impactBreakdown?.materialImpact || "Medium impact from materials"),
        productionImpact: String(analysis.impactBreakdown?.productionImpact || "Standard production methods"),
        transportImpact: String(analysis.impactBreakdown?.transportImpact || "Average transport emissions")
      }
    };
  } catch (error) {
    console.error('Error analyzing carbon impact:', error);
    // Return default values if analysis fails
    return {
      carbonFootprint: {
        manufacturing: 5.5,
        transport: 2.3,
        packaging: 1.2
      },
      waterUsage: 2000,
      sustainabilityScore: 50,
      recommendations: [
        "Consider eco-friendly alternatives",
        "Optimize packaging efficiency",
        "Review transportation methods"
      ],
      impactBreakdown: {
        materialImpact: "Medium impact from materials",
        productionImpact: "Standard production methods",
        transportImpact: "Average transport emissions"
      }
    };
  }
};

export default function SustainableContent() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState(null);
  const [error, setError] = useState('');
  const [scrapedData, setScrapedData] = useState(null);
  const [monthlyEmissions, setMonthlyEmissions] = useState([]);
  const [cart, setCart] = useState([]);
  const [carbonSaved, setCarbonSaved] = useState(0);
  const [products] = useState([
    {
      id: 1,
      name: 'Organic Cotton Sweater',
      price: 89,
      carbonFootprint: 2.5,
      image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800',
      description: 'Made from 100% organic cotton, eco-friendly dyes'
    },
    {
      id: 2,
      name: 'Recycled Denim Jeans',
      price: 120,
      carbonFootprint: 3.8,
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
      description: 'Created from recycled denim materials'
    },
    {
      id: 3,
      name: 'Hemp Blend T-Shirt',
      price: 45,
      carbonFootprint: 1.5,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
      description: 'Sustainable hemp and organic cotton blend'
    },
    {
      id: 4,
      name: 'Bamboo Fiber Dress',
      price: 95,
      carbonFootprint: 2.1,
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800',
      description: 'Eco-friendly bamboo fabric, naturally processed'
    },
    {
      id: 5,
      name: 'Recycled Polyester Jacket',
      price: 150,
      carbonFootprint: 3.2,
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
      description: 'Made from recycled plastic bottles'
    },
    {
      id: 6,
      name: 'Organic Linen Shirt',
      price: 75,
      carbonFootprint: 1.8,
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
      description: 'Sustainably harvested linen, natural dyes'
    }
  ]);
  const [activeInsight, setActiveInsight] = useState('general');
  const [aiInsights, setAiInsights] = useState({
    general: {
      title: 'General Insights',
      insights: [
        'This product uses organic cotton which saves 2,700 liters of water per item',
        'Manufacturing facility uses 45% renewable energy',
        'Product has a moderate sustainability score'
      ]
    }
  });
  const [activeFinder, setActiveFinder] = useState('materials');
  const [finderLoading, setFinderLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Safe number formatting function
  const formatNumber = (num) => {
    return num ? num.toFixed(3) : '0.000';
  };

  const generateClothingData = (baseData) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    return months.map(month => ({
      month,
      'Material Impact': Number((Math.random() * baseData.materialImpact * 0.3).toFixed(2)),
      'Water Usage': Number((Math.random() * baseData.waterUsage * 0.25).toFixed(2)),
      'Manufacturing': Number((Math.random() * baseData.manufacturing * 0.2).toFixed(2)),
      'Transportation': Number((Math.random() * baseData.transportation * 0.15).toFixed(2)),
      'Packaging': Number((Math.random() * baseData.packaging * 0.1).toFixed(2))
    }));
  };

  const analyzeProduct = async (e) => {
    e.preventDefault();
    if (!url) return;

    setIsAnalyzing(true);
    setError('');

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze product');
      }

      const { data } = await response.json();
      
      // Update state with scraped data
      setScrapedData({
        title: data.title,
        description: data.description,
        price: data.price,
        materials: data.materials,
        images: data.images,
        specifications: data.specifications
      });

      // Update product data with sustainability metrics
      setProductData({
        sustainabilityScore: data.sustainabilityScore,
        carbonFootprint: data.totalFootprint / 1000, // Convert to kg
        waterUsage: data.waterUsage,
        recyclability: data.recyclability,
        emissionsData: [
          { name: 'Manufacturing', value: data.manufacturingEmissions / 1000 },
          { name: 'Transportation', value: data.transportEmissions / 1000 },
          { name: 'Packaging', value: (data.totalFootprint * 0.2) / 1000 }
        ]
      });

    } catch (err) {
      setError('Failed to analyze product. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addToCart = (product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    setCarbonSaved(prevSaved => prevSaved + product.carbonFootprint);
    
    // Store in localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Custom colors matching the image
  const customColors = {
    darkGreen: '#0A5C36',
    mediumGreen: '#218B3E',
    lightGreen: '#41B649',
    yellowGreen: '#8DC63F',
    lightYellow: '#C5E384'
  };


  const checkSustainability = async (type) => {
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `Check the sustainability of this product: ${url}
        Return a detailed JSON object with these exact metrics:
        {
          "sustainabilityScore": (number between 0-100)
        }`;

      const result = await model.generateContent(prompt);
      let responseText = result.response.text();
      
      // Clean the response text
      responseText = responseText
        .replace(/```json\s*|\s*```/g, '') // Remove code blocks
        .replace(/^[^{]*/, '') // Remove any text before the first {
        .replace(/[^}]*$/, ''); // Remove any text after the last }

      if (!responseText.trim().startsWith('{') || !responseText.trim().endsWith('}')) {
        throw new Error('Invalid JSON structure received');
      }

      let analysis;
      try {
        analysis = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        // Fallback to default values if parsing fails
        analysis = {
          sustainabilityScore: 75
        };
      }

      // Ensure all required properties exist with default values
      const validatedAnalysis = {
        sustainabilityScore: analysis.sustainabilityScore || 0
      };

      // Generate realistic monthly data
      const baseMetrics = {
        materialImpact: validatedAnalysis.manufacturingEmissions * 0.4,
        waterUsage: validatedAnalysis.waterUsage * 0.001,
        manufacturing: validatedAnalysis.manufacturingEmissions,
        transportation: validatedAnalysis.transportEmissions,
        packaging: validatedAnalysis.totalFootprint * 0.05
      };

      setMonthlyEmissions(generateClothingData(baseMetrics));
      setProductData({
        ...validatedAnalysis,
        dateRange: "January 2024 - August 2024"
      });

    } catch (error) {
      console.error('Analysis error:', error);
      setError('Unable to analyze product. Please try again with a valid Amazon fashion URL.');
      
      // Set default data for demonstration
      const defaultAnalysis = {
        sustainabilityScore: 75
      };

      setProductData({
        ...defaultAnalysis,
        dateRange: "January 2024 - August 2024"
      });

      setMonthlyEmissions(generateClothingData({
        materialImpact: defaultAnalysis.manufacturingEmissions * 0.4,
        waterUsage: defaultAnalysis.waterUsage * 0.001,
        manufacturing: defaultAnalysis.manufacturingEmissions,
        transportation: defaultAnalysis.transportEmissions,
        packaging: defaultAnalysis.totalFootprint * 0.05
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleMetricClick = async (metricType) => {
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompts = {
        materials: `Analyze the material composition of this fashion product:
          Cotton: ${productData.materialBreakdown.cotton}%
          Polyester: ${productData.materialBreakdown.polyester}%
          Other: ${productData.materialBreakdown.other}%
          
          Provide 3 specific insights about:
          1. Environmental impact of these materials
          2. Sustainable alternatives
          3. Care recommendations for longevity
          
          Return in JSON format with title and array of 3 insights.`,
        
        water: `Analyze the water usage metrics:
          Total Usage: ${productData.waterUsage}L
          
          Provide 3 specific insights about:
          1. Water consumption comparison
          2. Water saving potential
          3. Industry water usage context
          
          Return in JSON format with title and array of 3 insights.`,
        
        carbon: `Analyze the carbon footprint:
          Total: ${productData.totalFootprint}kg CO2e
          Manufacturing: ${productData.manufacturingEmissions}kg
          Transport: ${productData.transportEmissions}kg
          
          Provide 3 specific insights about:
          1. Carbon impact breakdown
          2. Reduction opportunities
          3. Comparison with industry standards
          
          Return in JSON format with title and array of 3 insights.`
      };

      const result = await model.generateContent(prompts[metricType] || prompts.materials);
      const response = JSON.parse(result.response.text());
      
      setAiInsights(prev => ({
        ...prev,
        [metricType]: response
      }));
      setActiveInsight(metricType);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ title, value, icon, type, progress }) => (
    <div 
      onClick={() => handleMetricClick(type)}
      className="bg-white p-6 rounded-lg shadow-sm border border-accent-pink/20 
                 cursor-pointer hover:border-accent-orange transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-sm text-gray-600">{title}</h3>
      </div>
      <p className="text-2xl font-bold text-accent-orange">
        {typeof value === 'number' ? formatNumber(value) : value}
      </p>
      {progress && (
        <div className="h-1.5 bg-primary-pink rounded-full mt-2">
          <div
            className="h-full bg-accent-orange transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );

  const AiInsightsSection = () => (
    <div className="bg-primary-pink rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">🤖</span>
        <h4 className="text-lg font-semibold text-gray-800">
          {aiInsights[activeInsight]?.title || 'AI Sustainability Insights'}
          {finderLoading && <span className="ml-2 animate-pulse">analyzing...</span>}
        </h4>
      </div>
      <div className="space-y-4">
        {aiInsights[activeInsight]?.insights.map((insight, index) => (
          <div key={index} className="flex gap-3">
            <div className="w-1 bg-deep-pink rounded"></div>
            <p className="text-gray-600">{insight}</p>
          </div>
        ))}
      </div>
      {loading && (
        <div className="mt-4 flex items-center gap-2 text-gray-600">
          <span className="animate-spin">⚡</span>
          Analyzing...
        </div>
      )}
    </div>
  );

  const handleFinderClick = async (type) => {
    setActiveFinder(type);
    setFinderLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const formattedResult = await model.generateContent(formattingPrompt);
      let formattedInsights = formattedResult.response.text()
        .split('\n')
        .filter(line => line.trim().startsWith('•'))
        .map(line => line.trim())
        .map(line => {
          // Clean up and standardize the format
          line = line.replace('•', '').trim();
          line = line.replace(/\*\*/g, ''); // Remove markdown
          return line;
        })
        .filter(line => line.length > 0)
        .slice(0, 3); // Ensure exactly 3 points

      if (formattedInsights.length < 3) {
        formattedInsights = fallbackInsights[type];
      }

      setAiInsights({
        ...aiInsights,
        general: {
          title: 'Sustainability Insights',
          insights: formattedInsights
        }
      });

    } catch (error) {
      console.error('Finder analysis error:', error);
      setError('Failed to generate insights. Please try again.');
    } finally {
      setFinderLoading(false);
    }
  };

  const calculateCarbonImpact = (scrapedData) => {
    // Base calculations for different material types (kg CO2 per kg of material)
    const materialImpact = {
      cotton: 5.9,      // kg CO2 per kg of cotton
      polyester: 9.52,  // kg CO2 per kg of polyester
      nylon: 7.31,      // kg CO2 per kg of nylon
      wool: 25.0,       // kg CO2 per kg of wool
      linen: 1.6,       // kg CO2 per kg of linen
      silk: 110.0,      // kg CO2 per kg of silk
      default: 6.0      // default value for unknown materials
    };

    // Transportation emissions based on distance and method
    const transportEmissions = {
      local: 0.1,       // kg CO2 per km for local transport
      national: 0.5,    // kg CO2 per km for national transport
      international: 2.1 // kg CO2 per km for international transport
    };

    try {
      let totalCarbonFootprint = 0;
      let manufacturingEmissions = 0;
      let transportEmissions = 0;
      let packagingEmissions = 0;

      // Calculate manufacturing emissions based on materials
      if (scrapedData.materials && scrapedData.materials.length > 0) {
        manufacturingEmissions = scrapedData.materials.reduce((acc, material) => {
          const percentage = parseInt(material.match(/\d+/)?.[0] || 0) / 100;
          const materialType = Object.keys(materialImpact).find(type => 
            material.toLowerCase().includes(type)
          ) || 'default';
          
          return acc + (materialImpact[materialType] * percentage);
        }, 0);

        // Adjust for product weight (assuming average weight if not provided)
        const productWeight = scrapedData.specifications?.weight || 0.3; // kg
        manufacturingEmissions *= productWeight;
      }

      // Calculate transport emissions
      const isInternational = scrapedData.specifications?.origin?.toLowerCase().includes('import') ||
                             !scrapedData.specifications?.origin?.toLowerCase().includes('domestic');
      
      const transportDistance = isInternational ? 8000 : 1000; // km (estimated)
      transportEmissions = isInternational ? 
        transportDistance * transportEmissions.international :
        transportDistance * transportEmissions.national;

      // Calculate packaging emissions (based on product type and size)
      const productVolume = calculateProductVolume(scrapedData.specifications?.dimensions);
      packagingEmissions = productVolume * 0.2; // kg CO2 per m³

      // Total carbon footprint
      totalCarbonFootprint = manufacturingEmissions + transportEmissions + packagingEmissions;

      return {
        total: totalCarbonFootprint,
        manufacturing: manufacturingEmissions,
        transport: transportEmissions,
        packaging: packagingEmissions
      };
    } catch (error) {
      console.error('Error calculating carbon impact:', error);
      return null;
    }
  };

  // Helper function to calculate product volume from dimensions
  const calculateProductVolume = (dimensions) => {
    if (!dimensions) return 0.01; // default volume in m³
    
    try {
      // Parse dimensions string to get measurements
      const dims = dimensions.match(/\d+(\.\d+)?/g)?.map(Number) || [];
      if (dims.length >= 3) {
        return (dims[0] * dims[1] * dims[2]) / 1000000; // convert to m³
      }
      return 0.01; // default if parsing fails
    } catch (error) {
      return 0.01;
    }
  };

  const ScrapedDataDisplay = ({ scrapedData }) => {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);

    const donutOptions = {
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          titleColor: '#1f2937',
          bodyColor: '#1f2937',
          bodyFont: {
            size: 14
          },
          padding: 12,
          boxWidth: 10,
          boxHeight: 10,
          boxPadding: 3,
          usePointStyle: true,
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.raw.toFixed(1)} kg CO₂`;
            }
          }
        }
      },
      cutout: '70%',
      radius: '90%',
      animation: {
        animateScale: true,
        animateRotate: true
      },
      responsive: true,
      maintainAspectRatio: true
    };

    const calculateDonutData = () => {
      if (!analysis) return {
        labels: ['Manufacturing', 'Transportation', 'Packaging'],
        datasets: [{
          data: [0, 0, 0],
          backgroundColor: [
            'rgba(34, 197, 94, 0.9)',
            'rgba(59, 130, 246, 0.9)',
            'rgba(249, 115, 22, 0.9)'
          ],
          borderWidth: 2,
          borderColor: 'white',
          hoverOffset: 8,
          hoverBorderWidth: 0,
          offset: 4
        }]
      };

      return {
        labels: ['Manufacturing', 'Transportation', 'Packaging'],
        datasets: [{
          data: [
            analysis.carbonFootprint.manufacturing,
            analysis.carbonFootprint.transport,
            analysis.carbonFootprint.packaging
          ],
          backgroundColor: [
            'rgba(34, 197, 94, 0.9)',
            'rgba(59, 130, 246, 0.9)',
            'rgba(249, 115, 22, 0.9)'
          ],
          borderWidth: 2,
          borderColor: 'white',
          hoverOffset: 8,
          hoverBorderWidth: 0,
          offset: 4
        }]
      };
    };

    useEffect(() => {
      const getAnalysis = async () => {
        if (scrapedData) {
          setLoading(true);
          const result = await analyzeCarbonImpact(scrapedData);
          setAnalysis(result);
          setLoading(false);
        }
      };
      getAnalysis();
    }, [scrapedData]);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left side */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{scrapedData?.title || ''}</h2>
          
          {/* Material Composition Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Material Composition</h3>
            <div className="space-y-4">
              {scrapedData?.materials?.map((material, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-600">{String(material)}</span>
                  </div>
                  <span className="font-medium text-gray-800">
                    {material.match(/\d+/)?.[0] || ''}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Environmental Impact Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Environmental Impact</h3>
            <div className="space-y-4">
              {analysis?.recommendations?.map((rec, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-sm">{index + 1}</span>
                  </div>
                  <p className="text-gray-600">{String(rec)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Details Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Care Instructions</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-gray-600">Machine wash cold</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-gray-600">Tumble dry low</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-gray-600">Do not bleach</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="space-y-6">
          {/* Carbon Impact Tracker */}
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h3 className="text-xl font-semibold mb-8 text-gray-800 text-center">Carbon Impact Tracker</h3>
            
            <div className="relative aspect-square w-full max-w-[320px] mx-auto mb-8">
              <div className="absolute inset-0 rounded-full shadow-lg"></div>
              <Doughnut data={calculateDonutData()} options={donutOptions} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="bg-white bg-opacity-90 rounded-full p-6 shadow-inner">
                  <span className="text-4xl font-bold text-gray-800 block text-center">
                    {(analysis?.carbonFootprint.manufacturing + 
                      analysis?.carbonFootprint.transport + 
                      analysis?.carbonFootprint.packaging).toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500 block text-center">kg CO₂</span>
                </div>
              </div>
            </div>

            {/* Impact Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Water Usage</p>
                <p className="text-2xl font-bold text-gray-800">
                  {analysis?.waterUsage.toFixed(0)}L
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Eco Score</p>
                <p className="text-2xl font-bold text-gray-800">
                  {analysis?.sustainabilityScore}/100
                </p>
              </div>
            </div>

            {/* Impact Breakdown */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-semibold mb-4">Impact Breakdown</h4>
              <div className="space-y-4">
                {Object.entries(analysis?.impactBreakdown || {}).map(([key, value]) => (
                  <div key={key} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="font-medium text-gray-700 mb-1">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </div>
                    <p className="text-gray-600 text-sm">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="text-center py-16 px-4">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Sustainable Fashion Analyzer
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Analyze any fashion product's environmental impact and discover eco-friendly alternatives
        </p>
      </div>

      {/* Analysis Input Section */}
      <div className="max-w-4xl mx-auto px-4 mb-16">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Analyze Any Fashion Product
          </h2>
          <form onSubmit={analyzeProduct} className="space-y-4">
            <div className="space-y-2">
              <label className="text-gray-700 font-medium">Product URL</label>
              <div className="flex gap-4">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste any fashion product URL..."
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
                >
                  Analyze Impact
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Analysis Results Section */}
      {isAnalyzing ? (
        <div className="max-w-7xl mx-auto px-4 mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Analyzing...</h2>
            <AnalysisSkeleton />
          </div>
        </div>
      ) : productData && (
        <div className="max-w-7xl mx-auto px-4 space-y-8 mb-16">
          {/* Add ScrapedDataDisplay component here */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <ScrapedDataDisplay scrapedData={scrapedData} />
          </div>

          {/* Sustainability Breakdown */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold mb-6">Sustainability Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Material Impact</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Recyclability</span>
                    <span className="font-semibold">{productData.recyclability}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Biodegradability</span>
                    <span className="font-semibold">
                      {scrapedData.materials.some(m => 
                        m.toLowerCase().includes('organic') || 
                        m.toLowerCase().includes('natural')
                      ) ? 'High' : 'Low'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Manufacturing</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Production Emissions</span>
                    <span className="font-semibold">
                      {(productData.emissionsData[0].value).toFixed(1)} kg CO₂
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transport Emissions</span>
                    <span className="font-semibold">
                      {(productData.emissionsData[1].value).toFixed(1)} kg CO₂
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Care Instructions</h4>
                <div className="space-y-2">
                  {scrapedData.specifications?.care ? (
                    <p>{scrapedData.specifications.care}</p>
                  ) : (
                    <p className="text-gray-500">Care instructions not available</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold mb-6">Sustainability Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">How to Reduce Impact</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Wash in cold water to reduce energy consumption</li>
                  <li>• Air dry when possible</li>
                  <li>• Repair instead of replace</li>
                  <li>• Donate or recycle when no longer needed</li>
                </ul>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Environmental Benefits</h4>
                <ul className="space-y-2 text-sm">
                  {scrapedData.materials.some(m => m.toLowerCase().includes('organic')) && (
                    <li>• Made with organic materials, reducing pesticide use</li>
                  )}
                  {scrapedData.materials.some(m => m.toLowerCase().includes('recycled')) && (
                    <li>• Contains recycled materials, reducing waste</li>
                  )}
                  {productData.waterUsage < 2000 && (
                    <li>• Low water consumption in production</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Sustainable Alternatives
          </h2>
          <Link href="/sustainable-products" className="text-green-600 hover:text-green-700 font-medium">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
              <div className="relative h-64">
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Saves {product.carbonFootprint}kg CO₂
                  </span>
                </div>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-800 text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-800">${product.price}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      {cart.length > 0 && (
        <div className="fixed bottom-8 right-8 bg-white rounded-2xl shadow-lg p-6 border border-green-100">
          <div className="flex items-center gap-6">
            <div>
              <p className="font-semibold text-gray-800">Cart ({cart.length} items)</p>
              <p className="text-sm text-green-600">
                {carbonSaved.toFixed(2)}kg CO₂ saved
              </p>
            </div>
            <Link href="/cart">
              <button className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
                Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}