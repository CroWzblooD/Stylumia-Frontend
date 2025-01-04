export const fashionCategories = {
  tshirt: {
    title: "T-Shirts",
    tags: ["tshirt", "casual", "top", "basic"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
        tags: ["men", "casual", "tshirt", "maroon"]
      },
      {
        url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a",
        tags: ["women", "casual", "tshirt", "white"]
      },
      // Add more with tags
    ]
  },
  formal: {
    title: "Formal Wear",
    tags: ["formal", "business", "professional"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
        tags: ["men", "formal", "suit", "blue"]
      },
      // Add more with tags
    ]
  }
  // Add more categories with proper tags
};

export const searchFashionImages = (query) => {
  if (!query) return [];
  
  const searchTerms = query.toLowerCase().split(' ');
  let matchedImages = [];
  
  Object.values(fashionCategories).forEach(category => {
    category.images.forEach(image => {
      if (image.tags.some(tag => searchTerms.some(term => tag.includes(term)))) {
        matchedImages.push(image.url);
      }
    });
  });
  
  return matchedImages;
};

// Sample fashion images array
const fashionImages = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
  'https://images.unsplash.com/photo-1554568218-0f1715e72254',
  'https://images.unsplash.com/photo-1622445275576-721325763afe',
  'https://images.unsplash.com/photo-1483721310020-03333e577078',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9',
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b',
  'https://images.unsplash.com/photo-1595777457583-95e059d581b8',
  'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1',
  'https://images.unsplash.com/photo-1612336307429-8a898d10e223',
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b'
];

// Function to get random fashion images
export const getRandomFashionImages = (count) => {
  const shuffled = [...fashionImages].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};