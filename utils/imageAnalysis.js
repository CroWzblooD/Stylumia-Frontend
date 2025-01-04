import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

export async function analyzeImageWithAI(imageElement) {
  try {
    // Load MobileNet model
    const model = await mobilenet.load();
    
    // Convert image to tensor
    const tfImage = tf.browser.fromPixels(imageElement);
    
    // Get predictions
    const predictions = await model.classify(tfImage);
    
    // Cleanup
    tfImage.dispose();
    
    return predictions;
  } catch (error) {
    console.error('Error in AI analysis:', error);
    throw error;
  }
}

export function extractGarmentFeatures(predictions) {
  // Map AI predictions to garment features
  const features = {
    category: predictions[0].className.split(',')[0],
    confidence: predictions[0].probability,
    attributes: []
  };
  
  return features;
} 