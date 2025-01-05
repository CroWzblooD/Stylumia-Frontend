import { ComputerVisionClient } from '@azure/cognitiveservices-computervision';
import { ApiKeyCredentials } from '@azure/ms-rest-js';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const key = process.env.AZURE_VISION_KEY;
const endpoint = process.env.AZURE_VISION_ENDPOINT;

if (!key || !endpoint) {
  console.error('Azure credentials not found. Please check your .env file');
  throw new Error('Azure credentials not configured');
}

const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }),
  endpoint
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const form = formidable({
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Form parsing error:', err);
          reject(err);
          return;
        }
        resolve([fields, files]);
      });
    });

    // Get the image file
    const imageFile = files.image?.[0] || files.image;
    if (!imageFile || !imageFile.filepath) {
      console.error('No image file found in request');
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Read the file as buffer
    const imageBuffer = fs.readFileSync(imageFile.filepath);

    // Analyze image using Azure Computer Vision
    const features = [
      'Categories',
      'Color',
      'Description',
      'Objects',
      'Tags'
    ];

    const analysis = await computerVisionClient.analyzeImageInStream(
      imageBuffer,
      { visualFeatures: features }
    );

    // Process results
    const processedResults = {
      features: [
        {
          name: 'Category',
          value: analysis.categories[0]?.name || 'Unknown',
          confidence: analysis.categories[0]?.score
        },
        {
          name: 'Colors',
          value: analysis.color.dominantColors.join(', ') || 'Unknown',
          palette: analysis.color.dominantColors
        },
        {
          name: 'Pattern',
          value: detectPattern(analysis),
          confidence: 0.8
        },
        {
          name: 'Style',
          value: determineStyle(analysis),
          confidence: 0.85
        },
        {
          name: 'Material',
          value: determineFabric(analysis),
          confidence: 0.75
        }
      ],
      description: analysis.description.captions[0]?.text || '',
      tags: analysis.tags.map(tag => ({
        name: tag.name,
        confidence: tag.confidence
      })),
      marketTrend: 'Rising',
      demandScore: calculateDemandScore(analysis),
      risks: generateRiskAnalysis(analysis)
    };

    // Clean up temporary file
    try {
      fs.unlinkSync(imageFile.filepath);
    } catch (err) {
      console.warn('Failed to clean up temporary file:', err);
    }

    return res.status(200).json(processedResults);

  } catch (error) {
    console.error('Error processing image:', error);
    return res.status(500).json({ 
      error: 'Failed to analyze image',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

function detectPattern(analysis) {
  const patternKeywords = {
    'striped': ['stripe', 'striped', 'lines'],
    'floral': ['flower', 'floral', 'botanical'],
    'solid': ['solid', 'plain'],
    'checkered': ['check', 'plaid', 'gingham'],
    'dotted': ['dot', 'polka'],
    'printed': ['print', 'pattern']
  };

  const tags = analysis.tags.map(t => t.name.toLowerCase());
  
  for (const [pattern, keywords] of Object.entries(patternKeywords)) {
    if (keywords.some(keyword => tags.includes(keyword))) {
      return pattern;
    }
  }
  
  return 'solid';
}

function determineStyle(analysis) {
  const styleKeywords = {
    'casual': ['casual', 't-shirt', 'jeans', 'sneakers'],
    'formal': ['formal', 'suit', 'dress', 'elegant'],
    'sporty': ['sport', 'athletic', 'active'],
    'vintage': ['vintage', 'retro', 'classic'],
    'bohemian': ['boho', 'bohemian', 'ethnic'],
    'minimalist': ['minimal', 'simple', 'clean']
  };

  const tags = analysis.tags.map(t => t.name.toLowerCase());
  
  for (const [style, keywords] of Object.entries(styleKeywords)) {
    if (keywords.some(keyword => tags.includes(keyword))) {
      return style;
    }
  }
  
  return 'casual';
}

function determineFabric(analysis) {
  const fabricKeywords = {
    'cotton': ['cotton', 't-shirt', 'casual'],
    'denim': ['jeans', 'denim'],
    'leather': ['leather', 'suede'],
    'silk': ['silk', 'satin', 'glossy'],
    'wool': ['wool', 'knit', 'sweater'],
    'synthetic': ['polyester', 'nylon', 'synthetic']
  };

  const tags = analysis.tags.map(t => t.name.toLowerCase());
  
  for (const [fabric, keywords] of Object.entries(fabricKeywords)) {
    if (keywords.some(keyword => tags.includes(keyword))) {
      return fabric;
    }
  }
  
  return 'unknown';
}

function calculateDemandScore(analysis) {
  // Calculate demand score based on tags and categories
  const baseScore = 70;
  const tags = analysis.tags.map(t => t.name.toLowerCase());
  
  let score = baseScore;
  
  // Adjust score based on popular keywords
  const trendyKeywords = ['fashion', 'trendy', 'style', 'modern', 'popular'];
  score += trendyKeywords.filter(keyword => 
    tags.includes(keyword)
  ).length * 5;

  return Math.min(Math.max(score, 0), 100);
}

function generateRiskAnalysis(analysis) {
  const tags = analysis.tags.map(t => t.name.toLowerCase());
  
  return [
    {
      factor: 'Season Relevance',
      level: determineSeason(tags),
      description: 'Based on current seasonal trends'
    },
    {
      factor: 'Market Saturation',
      level: determineMarketSaturation(tags),
      description: 'Based on market availability'
    },
    {
      factor: 'Style Longevity',
      level: determineStyleLongevity(tags),
      description: 'Based on trend analysis'
    }
  ];
}

function determineSeason(tags) {
  const seasonalKeywords = ['summer', 'winter', 'spring', 'fall', 'seasonal'];
  return tags.some(tag => seasonalKeywords.includes(tag)) ? 'Low' : 'Medium';
}

function determineMarketSaturation(tags) {
  const commonKeywords = ['basic', 'common', 'popular', 'trendy'];
  return tags.some(tag => commonKeywords.includes(tag)) ? 'High' : 'Medium';
}

function determineStyleLongevity(tags) {
  const timelessKeywords = ['classic', 'timeless', 'basic', 'essential'];
  return tags.some(tag => timelessKeywords.includes(tag)) ? 'Low' : 'Medium';
} 