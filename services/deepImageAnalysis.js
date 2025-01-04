import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as mobilenet from '@tensorflow-models/mobilenet';

let model = null;

export async function loadModels() {
  if (model) return model;
  
  try {
    console.log('Loading AI model...');
    await tf.ready();
    await tf.setBackend('webgl');
    
    model = await mobilenet.load({
      version: 2,
      alpha: 1.0
    });
    console.log('Model loaded successfully');
    return model;
  } catch (error) {
    console.error('Error loading model:', error);
    throw error;
  }
}

export async function analyzeClothing(imageElement) {
  try {
    if (!model) {
      model = await loadModels();
    }

    // Get predictions
    const predictions = await model.classify(imageElement, 20);
    console.log('Raw predictions:', predictions);

    // Extract terms from predictions
    const terms = predictions.map(p => p.className.toLowerCase());
    
    // Extract colors
    const colors = await extractClothingColors(imageElement);
    
    // Process predictions
    const clothingDetails = {
      category: detectCategory(terms),
      style: detectStyle(terms),
      pattern: detectPattern(terms),
      material: detectMaterial(terms),
      features: detectFeatures(terms),
      gender: detectGender(terms),
      occasion: detectOccasion(terms),
      season: detectSeason(terms)
    };

    // Generate recommendations
    const recommendations = generateStyleRecommendations(clothingDetails);

    return {
      garmentInfo: {
        ...clothingDetails,
        colors,
        confidence: predictions[0]?.probability || 0,
        recommendations
      }
    };
  } catch (error) {
    console.error('Error in analysis:', error);
    throw error;
  }
}

function detectCategory(terms) {
  const categories = {
    top: ['shirt', 't-shirt', 'blouse', 'sweater', 'jacket', 'coat', 'hoodie'],
    bottom: ['pants', 'jeans', 'skirt', 'shorts', 'trousers'],
    dress: ['dress', 'gown', 'robe'],
    accessory: ['hat', 'cap', 'scarf', 'tie', 'belt']
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (terms.some(term => keywords.some(keyword => term.includes(keyword)))) {
      return category;
    }
  }
  return 'unknown';
}

function detectStyle(terms) {
  if (terms.some(term => term.includes('formal') || term.includes('suit') || term.includes('business'))) {
    return 'formal';
  }
  if (terms.some(term => term.includes('sport') || term.includes('athletic'))) {
    return 'sporty';
  }
  if (terms.some(term => term.includes('casual') || term.includes('everyday'))) {
    return 'casual';
  }
  return 'casual'; // default
}

function detectPattern(terms) {
  if (terms.some(term => term.includes('stripe'))) return 'striped';
  if (terms.some(term => term.includes('floral'))) return 'floral';
  if (terms.some(term => term.includes('check') || term.includes('plaid'))) return 'checked';
  if (terms.some(term => term.includes('dot'))) return 'dotted';
  return 'solid'; // default
}

function detectMaterial(terms) {
  if (terms.some(term => term.includes('denim'))) return 'denim';
  if (terms.some(term => term.includes('cotton'))) return 'cotton';
  if (terms.some(term => term.includes('wool'))) return 'wool';
  if (terms.some(term => term.includes('silk'))) return 'silk';
  if (terms.some(term => term.includes('leather'))) return 'leather';
  return 'unknown';
}

function detectFeatures(terms) {
  const features = new Set();
  
  // Log terms for debugging
  console.log('Analyzing terms for features:', terms);

  // Clothing Type Features
  if (terms.some(term => term.includes('t-shirt') || term.includes('tee shirt'))) {
    features.add('T-Shirt Style');
  }
  if (terms.some(term => term.includes('sweatshirt'))) {
    features.add('Sweatshirt Style');
  }
  if (terms.some(term => term.includes('jersey'))) {
    features.add('Jersey Material');
  }
  if (terms.some(term => term.includes('lab coat') || term.includes('coat'))) {
    features.add('Coat Style');
    features.add('Professional Wear');
  }
  if (terms.some(term => term.includes('cardigan'))) {
    features.add('Cardigan Style');
  }

  // Material Features
  if (terms.some(term => term.includes('wool') || term.includes('woolen'))) {
    features.add('Wool Material');
  }
  if (terms.some(term => term.includes('jean') || term.includes('denim'))) {
    features.add('Denim Material');
  }

  // Style Features
  if (terms.some(term => term.includes('formal') || term.includes('suit'))) {
    features.add('Formal Style');
  }
  if (terms.some(term => term.includes('casual'))) {
    features.add('Casual Style');
  }

  // Specific Features
  const specificFeatures = {
    'Pockets': ['pocket'],
    'Buttons': ['button'],
    'Zipper': ['zip', 'zipper'],
    'Collar': ['collar'],
    'V-Neck': ['v-neck'],
    'Round Neck': ['round neck', 'crew neck'],
    'Long Sleeves': ['long sleeve'],
    'Short Sleeves': ['short sleeve', 't-shirt'],
    'Sleeveless': ['sleeveless', 'tank'],
    'Hood': ['hood', 'hooded']
  };

  Object.entries(specificFeatures).forEach(([feature, keywords]) => {
    if (terms.some(term => keywords.some(keyword => term.includes(keyword)))) {
      features.add(feature);
    }
  });

  // Add gender-specific features
  if (terms.some(term => 
    term.includes('men') || 
    term.includes('man') || 
    term.includes('male') || 
    term.includes('boy')
  )) {
    features.add('Menswear');
  }
  if (terms.some(term => 
    term.includes('women') || 
    term.includes('woman') || 
    term.includes('female') || 
    term.includes('girl')
  )) {
    features.add('Womenswear');
  }

  // If no features detected, add some basic ones based on common terms
  if (features.size === 0) {
    if (terms.some(term => term.includes('shirt') || term.includes('top'))) {
      features.add('Basic Top');
    }
    if (terms.some(term => term.includes('pants') || term.includes('trouser'))) {
      features.add('Basic Bottom');
    }
    features.add('Casual Wear');
  }

  return Array.from(features);
}

function detectGender(terms) {
  // More comprehensive gender detection
  const maleTerms = ['men', 'man', 'male', 'boy', "men's", 'masculine'];
  const femaleTerms = ['women', 'woman', 'female', 'girl', "women's", 'feminine'];

  const isMale = terms.some(term => maleTerms.some(male => term.includes(male)));
  const isFemale = terms.some(term => femaleTerms.some(female => term.includes(female)));

  if (isMale && !isFemale) return 'Men';
  if (isFemale && !isMale) return 'Women';
  return 'Unisex';
}

function detectOccasion(terms) {
  if (terms.some(term => term.includes('formal') || term.includes('business'))) return 'formal';
  if (terms.some(term => term.includes('sport') || term.includes('athletic'))) return 'sports';
  if (terms.some(term => term.includes('casual'))) return 'casual';
  return 'casual';
}

function detectSeason(terms) {
  if (terms.some(term => term.includes('summer'))) return 'summer';
  if (terms.some(term => term.includes('winter'))) return 'winter';
  if (terms.some(term => term.includes('spring'))) return 'spring';
  if (terms.some(term => term.includes('fall') || term.includes('autumn'))) return 'fall';
  return 'all-season';
}

function generateStyleRecommendations(details) {
  const recommendations = [];
  
  switch(details.category) {
    case 'top':
      recommendations.push(
        'Pair with high-waisted jeans for a casual look',
        'Layer with a blazer for formal occasions',
        'Add a statement necklace to elevate the look'
      );
      break;
    case 'bottom':
      recommendations.push(
        'Match with a tucked-in blouse for a polished look',
        'Pair with sneakers for casual style',
        'Add a belt to define the waist'
      );
      break;
    case 'dress':
      recommendations.push(
        'Add a belt to define your waist',
        'Layer with a cardigan for cooler weather',
        'Pair with statement earrings for evening events'
      );
      break;
    default:
      recommendations.push(
        'Style with complementary accessories',
        'Choose shoes that match the occasion',
        'Consider layering for added dimension'
      );
  }

  return recommendations;
}

async function extractClothingColors(imageElement) {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match image
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    
    // Draw image to canvas
    ctx.drawImage(imageElement, 0, 0);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    // Create color map for counting
    const colorMap = new Map();
    
    // Process each pixel
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];
      
      // Skip transparent pixels
      if (a < 128) continue;
      
      // Convert to HSL to filter out very dark/light colors
      const [h, s, l] = rgbToHsl(r, g, b);
      
      // Skip very dark, very light, or very unsaturated colors
      if (l < 0.1 || l > 0.9 || s < 0.1) continue;
      
      // Quantize color to reduce number of unique colors
      const color = quantizeColor(r, g, b);
      colorMap.set(color, (colorMap.get(color) || 0) + 1);
    }
    
    // Sort colors by frequency and get top 3
    return Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([color]) => color);
  } catch (error) {
    console.error('Error extracting colors:', error);
    return ['#FFFFFF', '#CCCCCC', '#888888']; // Fallback colors
  }
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h, s, l];
}

function quantizeColor(r, g, b) {
  // Quantize to reduce number of colors (using steps of 32)
  const step = 32;
  r = Math.round(r / step) * step;
  g = Math.round(g / step) * step;
  b = Math.round(b / step) * step;
  return `rgb(${r},${g},${b})`;
} 