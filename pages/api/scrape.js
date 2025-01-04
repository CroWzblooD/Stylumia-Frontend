import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { url } = req.body;
    console.log('Scraping URL:', url);
    
    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://www.google.com'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    console.log('HTML loaded successfully');
    
    // Initialize product data object
    const productData = {
      title: '',
      description: '',
      brand: '',
      price: '',
      materials: [],
      specifications: {},
      images: []
    };

    // Title selectors
    const titleSelectors = [
      'h1',
      '[data-testid="product-title"]',
      '.product-title',
      '#productTitle',
      '.pdp-title',
      '[itemprop="name"]'
    ];

    for (const selector of titleSelectors) {
      const title = $(selector).first().text().trim();
      if (title) {
        productData.title = title;
        break;
      }
    }

    // Description selectors
    const descriptionSelectors = [
      '[data-testid="product-description"]',
      '.product-description',
      '#product-description',
      '[itemprop="description"]',
      'meta[name="description"]',
      '#description'
    ];

    for (const selector of descriptionSelectors) {
      let description = $(selector).text().trim();
      if (!description && selector.includes('meta')) {
        description = $(selector).attr('content');
      }
      if (description) {
        productData.description = description;
        break;
      }
    }

    // Price selectors
    const priceSelectors = [
      '.price',
      '[data-testid="product-price"]',
      '.product-price',
      '#priceblock_ourprice',
      '[itemprop="price"]',
      '.pdp-price'
    ];

    for (const selector of priceSelectors) {
      const price = $(selector).first().text().trim();
      if (price) {
        productData.price = price;
        break;
      }
    }

    // Material extraction
    const materialKeywords = [
      'material',
      'fabric',
      'composition',
      'made from',
      'made of',
      'fiber',
      'textile'
    ];

    // Search for material information in text
    $('*').each((_, element) => {
      const text = $(element).text().toLowerCase();
      
      // Check if text contains material information
      if (materialKeywords.some(keyword => text.includes(keyword))) {
        const materialText = $(element).text().trim();
        
        // Validate material text
        if (
          materialText.length < 200 && 
          !productData.materials.includes(materialText) &&
          (
            materialText.includes('%') ||
            /cotton|polyester|wool|silk|linen|nylon|rayon|spandex|elastane/i.test(materialText)
          )
        ) {
          productData.materials.push(materialText);
        }
      }
    });

    // Extract specifications
    const specKeywords = [
      'care',
      'washing',
      'dimensions',
      'size',
      'weight',
      'origin',
      'manufacturer'
    ];

    $('*').each((_, element) => {
      const text = $(element).text().toLowerCase();
      
      specKeywords.forEach(keyword => {
        if (text.includes(keyword)) {
          const specText = $(element).text().trim();
          if (specText.length < 100) {
            productData.specifications[keyword] = specText;
          }
        }
      });
    });

    // Extract images
    $('img').each((_, element) => {
      const src = $(element).attr('src') || $(element).attr('data-src');
      if (src && !src.includes('icon') && !src.includes('logo')) {
        productData.images.push(src);
      }
    });

    // Remove any complex URL formatting
    productData.images = [...new Set(productData.images)].slice(0, 5); // Just keep unique images, limit to 5

    // Clean up and validate data
    productData.materials = [...new Set(productData.materials)]; // Remove duplicates

    // Calculate sustainability metrics based on real data
    const sustainabilityMetrics = calculateSustainabilityMetrics(productData);

    // Add console.log to see the scraped data
    console.log('Scraped Product Data:', productData);

    return res.status(200).json({
      success: true,
      data: {
        ...productData,
        ...sustainabilityMetrics
      }
    });

  } catch (error) {
    console.error('Scraping error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to scrape product data',
      error: error.message 
    });
  }
}
// Helper function to calculate sustainability metrics
function calculateSustainabilityMetrics(productData) {
  // Base metrics
  let metrics = {
    totalFootprint: 0,
    waterUsage: 0,
    manufacturingEmissions: 0,
    transportEmissions: 0,
    recyclability: 0,
    sustainabilityScore: 0
  };

  // Calculate based on materials
  productData.materials.forEach(material => {
    const materialLower = material.toLowerCase();
    
    if (materialLower.includes('cotton')) {
      if (materialLower.includes('organic')) {
        metrics.waterUsage += 2500;
        metrics.totalFootprint += 8000;
      } else {
        metrics.waterUsage += 4000;
        metrics.totalFootprint += 15000;
      }
    }
    
    if (materialLower.includes('polyester')) {
      if (materialLower.includes('recycled')) {
        metrics.totalFootprint += 7000;
        metrics.waterUsage += 1500;
      } else {
        metrics.totalFootprint += 12000;
        metrics.waterUsage += 2500;
      }
    }
    
    // Add more material calculations...
  });

  // Adjust based on specifications
  if (productData.specifications.care) {
    const careLower = productData.specifications.care.toLowerCase();
    if (careLower.includes('hand wash')) {
      metrics.waterUsage *= 0.8;
    }
    if (careLower.includes('cold')) {
      metrics.totalFootprint *= 0.9;
    }
  }

  // Calculate final scores
  metrics.manufacturingEmissions = metrics.totalFootprint * 0.6;
  metrics.transportEmissions = metrics.totalFootprint * 0.2;
  metrics.recyclability = calculateRecyclability(productData.materials);
  metrics.sustainabilityScore = calculateSustainabilityScore(metrics);

  return metrics;
}

function calculateRecyclability(materials) {
  let score = 70; // Base score
  materials.forEach(material => {
    const materialLower = material.toLowerCase();
    if (materialLower.includes('recycled')) score += 10;
    if (materialLower.includes('organic')) score += 5;
    if (materialLower.includes('polyester')) score -= 5;
    if (materialLower.includes('elastane') || materialLower.includes('spandex')) score -= 10;
  });
  return Math.min(Math.max(score, 0), 100); // Keep between 0-100
}

function calculateSustainabilityScore(metrics) {
  const score = (
    (100 - (metrics.totalFootprint / 500)) * 0.4 +
    (100 - (metrics.waterUsage / 100)) * 0.3 +
    metrics.recyclability * 0.3
  );
  return Math.min(Math.max(Math.round(score), 0), 100);
}
