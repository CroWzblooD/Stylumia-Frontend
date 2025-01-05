export const fashionCategories = {
  whiteTshirt: {
    title: "White T-Shirts",
    tags: ["white", "tshirt", "casual", "top"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1581655353564-df123a1eb820",
        tags: ["white", "tshirt", "men", "basic"]
      },
      {
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
        tags: ["white", "tshirt", "men", "casual"]
      },
      {
        url: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34",
        tags: ["white", "tshirt", "women", "basic"]
      },
      {
        url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a",
        tags: ["white", "tshirt", "women", "casual"]
      }
    ]
  },
  blackTshirt: {
    title: "Black T-Shirts",
    tags: ["black", "tshirt", "casual", "top"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1503341504253-dff4815485f1",
        tags: ["black", "tshirt", "men", "basic"]
      },
      {
        url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27",
        tags: ["black", "tshirt", "men", "casual"]
      },
      {
        url: "https://images.unsplash.com/photo-1554568218-0f1715e72254",
        tags: ["black", "tshirt", "women", "basic"]
      },
      {
        url: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8",
        tags: ["black", "tshirt", "women", "casual"]
      }
    ]
  },
  redDress: {
    title: "Red Dresses",
    tags: ["red", "dress", "women"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8",
        tags: ["red", "dress", "women", "formal"]
      },
      {
        url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1",
        tags: ["red", "dress", "women", "casual"]
      },
      {
        url: "https://images.unsplash.com/photo-1612336307429-8a898d10e223",
        tags: ["red", "dress", "women", "party"]
      },
      {
        url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446",
        tags: ["red", "dress", "women", "evening"]
      }
    ]
  },
  blackDress: {
    title: "Black Dresses",
    tags: ["black", "dress", "women"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956",
        tags: ["black", "dress", "women", "formal"]
      },
      {
        url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7",
        tags: ["black", "dress", "women", "evening"]
      },
      {
        url: "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e",
        tags: ["black", "dress", "women", "party"]
      },
      {
        url: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f",
        tags: ["black", "dress", "women", "casual"]
      }
    ]
  },
  jeans: {
    title: "Jeans",
    tags: ["jeans", "denim", "casual"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
        tags: ["blue", "jeans", "men", "denim"]
      },
      {
        url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
        tags: ["blue", "jeans", "women", "casual"]
      },
      {
        url: "https://images.unsplash.com/photo-1582552938357-32b906df40cb",
        tags: ["black", "jeans", "men", "denim"]
      },
      {
        url: "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec",
        tags: ["black", "jeans", "women", "casual"]
      }
    ]
  }
};

export const searchFashionImages = (query) => {
  if (!query) return [];
  
  const searchTerms = query.toLowerCase().split(' ');
  let matchedImages = [];
  
  Object.values(fashionCategories).forEach(category => {
    category.images.forEach(image => {
      // Check if ALL search terms match the image tags
      if (searchTerms.every(term => 
        image.tags.some(tag => tag.includes(term))
      )) {
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