import { getRandomFashionImages } from '@/components/fashionImages';

export default async function handler(req, res) {
  // Always return exactly 12 random images
  const randomImages = getRandomFashionImages(12);

  // Return a consistent response structure
  const response = {
    similarStyles: randomImages.slice(0, 4),
    colorMatches: randomImages.slice(4, 8),
    recommendations: randomImages.slice(8, 12),
    analysis: {
      category: 'fashion',
      style: 'mixed',
      color: 'various'
    }
  };

  return res.status(200).json(response);
}