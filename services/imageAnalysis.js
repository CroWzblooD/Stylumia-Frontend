import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

let mobilenetModel = null;
let cocoModel = null;

// Load models
export async function loadModels() {
  try {
    mobilenetModel = await mobilenet.load();
    cocoModel = await cocoSsd.load();
    return true;
  } catch (error) {
    console.error('Error loading models:', error);
    return false;
  }
}

// Analyze image
export async function analyzeImage(imageElement) {
  try {
    if (!mobilenetModel || !cocoModel) {
      await loadModels();
    }

    // Convert image to tensor
    const tfImage = tf.browser.fromPixels(imageElement);
    
    // Get classifications from MobileNet
    const classifications = await mobilenetModel.classify(tfImage);
    
    // Get object detection from COCO-SSD
    const objects = await cocoModel.detect(imageElement);

    // Cleanup
    tfImage.dispose();

    // Process results
    const results = processResults(classifications, objects);
    return results;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}

function processResults(classifications, objects) {
  // Extract clothing related information
  const clothingObjects = objects.filter(obj => 
    ['person', 'tie', 'shirt', 'dress', 'pants', 'shoe'].includes(obj.class)
  );

  const features = classifications.filter(item => 
    item.className.toLowerCase().includes('wear') ||
    item.className.toLowerCase().includes('dress') ||
    item.className.toLowerCase().includes('shirt') ||
    item.className.toLowerCase().includes('jacket')
  );

  return {
    category: getCategory(features, clothingObjects),
    attributes: {
      style: getStyle(features),
      pattern: getPattern(features),
      material: getMaterial(features),
      colors: ['#000000'] // Placeholder for color detection
    },
    confidence: features[0]?.probability || 0,
    detectedObjects: clothingObjects
  };
}

function getCategory(features, objects) {
  const categories = {
    'shirt': ['shirt', 't-shirt', 'polo'],
    'dress': ['dress', 'gown'],
    'pants': ['pants', 'jeans', 'trousers'],
    'jacket': ['jacket', 'coat', 'blazer'],
    'shoes': ['shoes', 'sneakers', 'boots']
  };

  // Check objects first
  const detectedObject = objects[0]?.class;
  if (detectedObject) {
    return detectedObject;
  }

  // Check features
  const feature = features[0]?.className.toLowerCase();
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => feature.includes(keyword))) {
      return category;
    }
  }

  return 'clothing';
}

function getStyle(features) {
  const styles = ['casual', 'formal', 'sporty', 'elegant'];
  const detected = features.find(f => 
    styles.some(style => f.className.toLowerCase().includes(style))
  );
  return detected ? detected.className : 'casual';
}

function getPattern(features) {
  const patterns = ['solid', 'striped', 'floral', 'patterned'];
  const detected = features.find(f => 
    patterns.some(pattern => f.className.toLowerCase().includes(pattern))
  );
  return detected ? detected.className : 'solid';
}

function getMaterial(features) {
  const materials = ['cotton', 'denim', 'leather', 'silk', 'wool'];
  const detected = features.find(f => 
    materials.some(material => f.className.toLowerCase().includes(material))
  );
  return detected ? detected.className : 'cotton';
} 