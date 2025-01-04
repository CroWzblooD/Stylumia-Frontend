import { ImageAnnotatorClient } from '@google-cloud/vision';

const vision = new ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_CLOUD_VISION_KEY_PATH,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { imageBase64 } = req.body;
    
    // Analyze image with Google Cloud Vision
    const [result] = await vision.annotateImage({
      image: { content: imageBase64.split(',')[1] },
      features: [
        { type: 'LABEL_DETECTION' },
        { type: 'OBJECT_LOCALIZATION' },
        { type: 'IMAGE_PROPERTIES' },
        { type: 'TEXT_DETECTION' },
      ],
    });

    // Extract relevant features
    const labels = result.labelAnnotations || [];
    const objects = result.localizedObjectAnnotations || [];
    const colors = result.imagePropertiesAnnotation?.dominantColors?.colors || [];
    const text = result.textAnnotations?.[0]?.description || '';

    // Process and categorize the results
    const garmentFeatures = {
      category: objects.find(obj => 
        ['Clothing', 'Dress', 'Shirt', 'Pants'].includes(obj.name)
      )?.name || labels[0]?.description,
      
      attributes: {
        colors: colors.slice(0, 3).map(color => ({
          rgb: `rgb(${color.color.red}, ${color.color.green}, ${color.color.blue})`,
          score: color.score
        })),
        
        style: labels
          .filter(label => 
            ['Casual', 'Formal', 'Sporty', 'Elegant'].some(style => 
              label.description.toLowerCase().includes(style.toLowerCase())
            )
          )
          .map(label => ({
            name: label.description,
            confidence: label.score
          })),

        pattern: labels
          .filter(label => 
            ['Pattern', 'Solid', 'Striped', 'Floral'].some(pattern => 
              label.description.toLowerCase().includes(pattern.toLowerCase())
            )
          )
          .map(label => ({
            name: label.description,
            confidence: label.score
          })),

        material: labels
          .filter(label => 
            ['Cotton', 'Silk', 'Wool', 'Polyester', 'Denim'].some(material => 
              label.description.toLowerCase().includes(material.toLowerCase())
            )
          )
          .map(label => ({
            name: label.description,
            confidence: label.score
          }))
      },

      brandInfo: text.match(/[A-Za-z]+/g) || [],
      confidence: objects[0]?.score || labels[0]?.score || 0
    };

    res.status(200).json(garmentFeatures);
  } catch (error) {
    console.error('Vision API Error:', error);
    res.status(500).json({ message: 'Error analyzing image' });
  }
} 