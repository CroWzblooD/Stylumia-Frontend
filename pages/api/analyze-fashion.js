const { ComputerVisionClient } = require("@azure/cognitiveservices-computervision");
const { ApiKeyCredentials } = require("@azure/ms-rest-js");

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

// Azure credentials
const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ 
    inHeader: { 
      'Ocp-Apim-Subscription-Key': process.env.AZURE_VISION_KEY 
    }
  }),
  process.env.AZURE_VISION_ENDPOINT
);

const fashionDatabase = {
  casual: [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
    "https://images.unsplash.com/photo-1554568218-0f1715e72254",
    "https://images.unsplash.com/photo-1622445275576-721325763afe",
  ],
  formal: [
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
    "https://images.unsplash.com/photo-1598808503746-f34c53b9323e",
    "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc",
  ],
  streetwear: [
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9",
  ]
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ success: false, error: 'No image provided' });
    }

    // Convert base64 to Buffer
    const imageBuffer = Buffer.from(imageBase64, 'base64');

    // Analyze the image using Azure Computer Vision with buffer
    const analysis = await computerVisionClient.analyzeImageInStream(
      imageBuffer,
      {
        visualFeatures: ["Tags", "Description", "Objects"],
      }
    );

    console.log('Azure Analysis:', analysis); // Debug log

    // Extract relevant tags and categories
    const fashionTags = analysis.tags
      .filter(tag => 
        tag.confidence > 0.5 && 
        ['clothing', 'fashion', 'apparel', 'dress', 'shirt', 'pants', 'jacket', 'formal', 'casual', 'streetwear']
          .some(keyword => tag.name.toLowerCase().includes(keyword))
      )
      .map(tag => tag.name.toLowerCase());

    // Determine the style category based on tags
    let styleCategory = 'casual'; // default
    if (fashionTags.some(tag => tag.includes('formal') || tag.includes('suit') || tag.includes('dress'))) {
      styleCategory = 'formal';
    } else if (fashionTags.some(tag => tag.includes('street') || tag.includes('urban') || tag.includes('hip'))) {
      styleCategory = 'streetwear';
    }

    // Get similar images based on style category
    const similarImages = fashionDatabase[styleCategory] || fashionDatabase.casual;

    // Add analysis details
    const results = {
      style: styleCategory,
      confidence: Math.max(...analysis.tags.map(t => t.confidence)),
      similarImages: similarImages,
      tags: fashionTags,
      description: analysis.description.captions[0]?.text || 'Fashion item'
    };

    console.log('Processing results:', results); // Debug log

    return res.status(200).json({ 
      success: true, 
      results: similarImages,
      analysis: results
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      details: error.details || {} // Include Azure error details if available
    });
  }
}