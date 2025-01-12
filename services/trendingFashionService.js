import { scrapeFashionData, analyzeTrends } from './scraperService';

export const getTrendingFashion = async (page = 1) => {
  try {
    // Fetch and analyze fashion data
    const fashionPosts = await scrapeFashionData();
    const trends = await analyzeTrends(fashionPosts);

    // Process trend data
    const categories = Object.entries(trends.categories)
      .map(([name, data]) => ({
        name,
        trendScore: Math.round((data.count / fashionPosts.length) * 100),
        styles: data.posts
          .slice(0, 3)
          .map(post => post.title.split(':')[0].trim())
      }))
      .sort((a, b) => b.trendScore - a.trendScore);

    // Prepare statistics for visualization
    const statistics = {
      daily: trends.engagement.map(item => ({
        name: new Date(item.date).toLocaleDateString(),
        value: item.count
      })),
      sources: Object.entries(trends.sources).map(([source, data]) => ({
        name: source,
        value: Math.round((data.count / fashionPosts.length) * 100)
      }))
    };

    // Paginate posts
    const postsPerPage = 12;
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const paginatedPosts = fashionPosts
      .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
      .slice(startIndex, endIndex);

    return {
      topPosts: paginatedPosts,
      categories,
      statistics,
      hasMore: fashionPosts.length > endIndex
    };
  } catch (error) {
    console.error('Error in getTrendingFashion:', error);
    throw error;
  }
}; 