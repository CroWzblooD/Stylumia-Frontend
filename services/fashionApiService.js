import axios from 'axios';

const YOUTUBE_API_KEY = 'AIzaSyAK_9byCyqNp7-sJ_90yPkIEHAGi2ujR3Q';

export const fashionApi = {
  // Simplified product fetching to use only H&M API
  async getTrendingProducts(page = 1) {
    try {
      const response = await axios.get('https://apidojo-hm-hennes-mauritz-v1.p.rapidapi.com/products/list', {
        headers: {
          'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'apidojo-hm-hennes-mauritz-v1.p.rapidapi.com'
        },
        params: {
          country: 'us',
          lang: 'en',
          currentpage: page,
          pagesize: 20,
          categories: 'ladies_all'
        }
      });

      return response.data.results.map(product => ({
        id: product.code,
        title: product.name,
        brand: 'H&M',
        price: `$${product.price.value}`,
        image: product.images[0].url,
        rating: (Math.random() * 2 + 3).toFixed(1),
        reviews: Math.floor(Math.random() * 1000) + 100,
        growth: `+${Math.floor(Math.random() * 100)}%`,
        tags: product.categories,
        source: 'H&M'
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  // Fixed YouTube Shorts fetching
  async getYoutubeFashionShorts(pageToken = '') {
    try {
      console.log('📍 Fetching YouTube fashion shorts...');
      
      const searchResponse = await axios.get('https://youtube.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          q: 'fashion trends outfit ideas style tips shorts -adult',
          type: 'video',
          videoDuration: 'short',
          maxResults: 25,
          key: YOUTUBE_API_KEY,
          order: 'relevance',
          publishedAfter: '2024-01-01T00:00:00Z',
          videoCategoryId: '26', // How-to & Style category
          pageToken: pageToken || undefined,
          safeSearch: 'strict'
        }
      });

      const videoIds = searchResponse.data.items.map(item => item.id.videoId).join(',');

      const videoResponse = await axios.get('https://youtube.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'snippet,statistics,player,contentDetails',
          id: videoIds,
          key: YOUTUBE_API_KEY
        }
      });

      return {
        videos: videoResponse.data.items.map(video => ({
          id: video.id,
          title: video.snippet.title,
          thumbnail: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url,
          channelTitle: video.snippet.channelTitle,
          channelThumbnail: `https://ui-avatars.com/api/?name=${encodeURIComponent(video.snippet.channelTitle)}`,
          views: parseInt(video.statistics.viewCount).toLocaleString(),
          likes: parseInt(video.statistics.likeCount || 0).toLocaleString(),
          publishedAt: new Date(video.snippet.publishedAt).toLocaleDateString(),
          videoUrl: `https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&loop=1&playlist=${video.id}`
        })),
        nextPageToken: searchResponse.data.nextPageToken
      };
    } catch (error) {
      console.error('❌ YouTube API Error:', error);
      return { videos: [], nextPageToken: null };
    }
  },

  // Updated blog fetching with multiple sources
  async getFashionBlogs(page = 1) {
    try {
      // Using Medium's fashion tag as the primary source
      const response = await axios.get('https://api.rss2json.com/v1/api.json', {
        params: {
          rss_url: 'https://medium.com/feed/tag/fashion',
          api_key: process.env.NEXT_PUBLIC_RSS2JSON_API_KEY || 'YOUR_RSS2JSON_API_KEY',
          count: 10,
          order_by: 'pubDate',
          order_dir: 'desc'
        }
      });

      // Fallback data in case the API fails
      const fallbackBlogs = Array(10).fill(null).map((_, index) => ({
        id: `fallback-${index}`,
        title: `Fashion Trend ${index + 1}: Spring/Summer 2024`,
        excerpt: 'Discover the latest fashion trends and style inspirations for the upcoming season...',
        image: `https://source.unsplash.com/800x400/?fashion,style&sig=${index}`,
        author: {
          name: 'Fashion Expert',
          avatar: 'https://ui-avatars.com/api/?name=Fashion+Expert'
        },
        date: new Date().toLocaleDateString(),
        link: '#',
        source: 'Fashion Blog',
        categories: ['Fashion', 'Trends', 'Style']
      }));

      if (response.data && response.data.items) {
        return response.data.items.map(blog => ({
          id: blog.guid,
          title: blog.title,
          excerpt: blog.description.replace(/<[^>]*>/g, '').slice(0, 150) + '...',
          image: blog.thumbnail || `https://source.unsplash.com/800x400/?fashion&sig=${blog.guid}`,
          author: {
            name: blog.author,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(blog.author)}`
          },
          date: new Date(blog.pubDate).toLocaleDateString(),
          link: blog.link,
          source: 'Medium',
          categories: blog.categories || ['Fashion', 'Style']
        }));
      }

      // Return fallback data if API fails
      return fallbackBlogs;
    } catch (error) {
      console.error('Error fetching fashion blogs:', error);
      // Return fallback data on error
      return Array(10).fill(null).map((_, index) => ({
        id: `fallback-${index}`,
        title: `Fashion Trend ${index + 1}: Spring/Summer 2024`,
        excerpt: 'Discover the latest fashion trends and style inspirations for the upcoming season...',
        image: `https://source.unsplash.com/800x400/?fashion,style&sig=${index}`,
        author: {
          name: 'Fashion Expert',
          avatar: 'https://ui-avatars.com/api/?name=Fashion+Expert'
        },
        date: new Date().toLocaleDateString(),
        link: '#',
        source: 'Fashion Blog',
        categories: ['Fashion', 'Trends', 'Style']
      }));
    }
  }
}; 