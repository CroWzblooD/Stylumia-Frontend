import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// Cache for storing API responses
const cache = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// AI prompt templates for different analysis types
const FASHION_PROMPTS = {
  category: (category, country) => `
    Analyze current fashion trends for ${category} in ${country}:
    {
      "trends": [
        {
          "title": "Trend name",
          "trendScore": 0-100,
          "growth": percentage,
          "priceRange": "budget/moderate/premium/luxury",
          "demographics": [
            { "generation": "Gen Z/Millennial/Gen X", "percentage": 0-100 }
          ],
          "colors": ["color1", "color2"],
          "materials": ["material1", "material2"],
          "sustainability": 0-100,
          "weeklyData": [number array for 7 days],
          "relatedTerms": ["term1", "term2"]
        }
      ],
      "marketInsights": {
        "marketSize": "Value in USD",
        "growth": percentage,
        "ecommerceShare": percentage,
        "sustainabilityImpact": 0-100,
        "priceSegmentation": {
          "budget": percentage,
          "moderate": percentage,
          "premium": percentage,
          "luxury": percentage
        }
      }
    }
  `,
  
  global: `
    Generate global fashion market analysis with this structure:
    {
      "intensityMap": {
        "US": 0-100,
        "CN": 0-100,
        // other country codes with trend intensity
      },
      "globalTrends": [
        {
          "category": "category name",
          "trendScore": 0-100,
          "growth": percentage,
          "regions": ["region1", "region2"]
        }
      ],
      "marketMetrics": {
        "totalMarket": "Value in USD",
        "growth": percentage,
        "topMarkets": [
          { "country": "name", "share": percentage }
        ]
      }
    }
  `,

  country: (country) => `
    Analyze fashion market for ${country}:
    {
      "marketSize": "Value in USD",
      "growth": percentage,
      "demographics": [
        { "group": "name", "share": percentage }
      ],
      "topStyles": [
        { "name": "style name", "popularity": 0-100 }
      ],
      "ecommerce": {
        "penetration": percentage,
        "growth": percentage,
        "platforms": [
          { "name": "platform name", "share": percentage }
        ]
      },
      "localBrands": [
        { "name": "brand name", "marketShare": percentage }
      ],
      "consumerBehavior": {
        "pricePreference": "budget/moderate/premium/luxury",
        "sustainabilityFocus": 0-100,
        "onlineShoppingFrequency": "frequency"
      }
    }
  `
};

// Helper function to get AI analysis
async function getAIAnalysis(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error('AI Analysis Error:', error);
    throw new Error('Failed to generate fashion insights');
  }
}

// Helper function to get fashion images from Pexels
async function getFashionImages(query, count = 1) {
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${query}&per_page=${count}`,
      {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_PEXELS_API_KEY
        }
      }
    );
    const data = await response.json();
    return data.photos.map(photo => ({
      id: photo.id,
      url: photo.src.large,
      photographer: photo.photographer,
      alt: photo.alt
    }));
  } catch (error) {
    console.error('Image Fetch Error:', error);
    return [];
  }
}

// Main export functions
export const fetchCategoryTrends = async (category, country = 'global') => {
  const cacheKey = `category-${category}-${country}`;
  
  // Check cache
  if (cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }

  try {
    const [aiData, images] = await Promise.all([
      getAIAnalysis(FASHION_PROMPTS.category(category, country)),
      getFashionImages(`${category} fashion trend 2024`, 5)
    ]);

    const trendData = {
      ...aiData,
      images,
      timestamp: Date.now()
    };

    // Update cache
    cache.set(cacheKey, { data: trendData, timestamp: Date.now() });
    
    return trendData;
  } catch (error) {
    console.error('Category Trends Error:', error);
    throw error;
  }
};

export const fetchGlobalTrends = async () => {
  const cacheKey = 'global-trends';
  
  if (cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }

  try {
    const globalData = await getAIAnalysis(FASHION_PROMPTS.global);
    
    // Update cache
    cache.set(cacheKey, { data: globalData, timestamp: Date.now() });
    
    return globalData;
  } catch (error) {
    console.error('Global Trends Error:', error);
    throw error;
  }
};

export const fetchCountryTrends = async (countryCode) => {
  const cacheKey = `country-${countryCode}`;
  
  if (cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }

  try {
    const [countryData, images] = await Promise.all([
      getAIAnalysis(FASHION_PROMPTS.country(countryCode)),
      getFashionImages(`${countryCode} fashion street style`, 8)
    ]);

    const trendData = {
      ...countryData,
      images,
      timestamp: Date.now()
    };

    // Update cache
    cache.set(cacheKey, { data: trendData, timestamp: Date.now() });
    
    return trendData;
  } catch (error) {
    console.error('Country Trends Error:', error);
    throw error;
  }
};