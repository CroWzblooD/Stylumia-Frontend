import { scrapeFashionData } from '../../services/scraperService';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const page = parseInt(req.query.page) || 1;

  try {
    console.log(`🚀 Starting fashion data scraping for page ${page}...`);
    const data = await scrapeFashionData(page);
    
    console.log(`✅ Successfully scraped ${data.products.length} products`);
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Scraping error:', error);
    res.status(500).json({ error: 'Failed to scrape fashion data' });
  }
} 