import axios from 'axios';

const NEWS_API_KEY = 'ed089d581b824a308c52fb11df9cb311';
const BASE_URL = 'https://newsapi.org/v2';

export const blogApi = {
  async getFashionBlogs(page = 1) {
    try {
      const response = await axios.get(`${BASE_URL}/everything`, {
        params: {
          q: 'fashion OR style OR trends',
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 12,
          page,
          apiKey: NEWS_API_KEY,
          domains: 'vogue.com,elle.com,harpersbazaar.com,wwd.com,fashionista.com,whowhatwear.com'
        }
      });

      return {
        blogs: response.data.articles.map(article => ({
          id: article.url,
          title: article.title,
          excerpt: article.description,
          image: article.urlToImage || 'https://source.unsplash.com/800x400/?fashion',
          author: {
            name: article.author || article.source.name,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author || article.source.name)}`
          },
          date: new Date(article.publishedAt).toLocaleDateString(),
          link: article.url,
          source: article.source.name,
          categories: ['Fashion', 'Style', 'Trends']
        })),
        hasMore: response.data.totalResults > page * 12
      };
    } catch (error) {
      console.error('Error fetching fashion blogs:', error);
      throw error;
    }
  }
}; 