'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineFilter, HiOutlineChartBar } from 'react-icons/hi';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fashionApi } from '../services/fashionApiService';
import { FashionShort } from './FashionShort';
import { blogApi } from '../services/blogApiService';

export default function TrendingFashion() {
  const [videos, setVideos] = useState([]);
  const [nextPageToken, setNextPageToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('shorts');
  const [blogs, setBlogs] = useState([]);
  const [blogPage, setBlogPage] = useState(1);
  const [blogLoading, setBlogLoading] = useState(false);
  const [blogError, setBlogError] = useState(null);
  const [hasMoreBlogs, setHasMoreBlogs] = useState(true);

  const fetchShorts = async (pageToken = '') => {
    try {
      setLoading(true);
      const { videos: newVideos, nextPageToken: newToken } = await fashionApi.getYoutubeFashionShorts(pageToken);
      
      if (pageToken === '') {
        setVideos(newVideos || []); // Ensure we always set an array
      } else {
        setVideos(prev => [...prev, ...(newVideos || [])]);
      }
      setNextPageToken(newToken);
      setError(null);
    } catch (err) {
      console.error('Error fetching shorts:', err);
      setError('Failed to load fashion shorts');
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogs = async (page = 1) => {
    try {
      setBlogLoading(true);
      const { blogs: newBlogs, hasMore } = await blogApi.getFashionBlogs(page);
      
      if (page === 1) {
        setBlogs(newBlogs);
      } else {
        setBlogs(prev => [...prev, ...newBlogs]);
      }
      setHasMoreBlogs(hasMore);
      setBlogError(null);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setBlogError('Failed to load fashion blogs');
    } finally {
      setBlogLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'shorts') {
      fetchShorts();
    } else {
      fetchBlogs();
    }
  }, [activeTab]);

  const loadMoreShorts = () => {
    if (!loading && nextPageToken) {
      fetchShorts(nextPageToken);
    }
  };

  const loadMoreBlogs = () => {
    if (!blogLoading && hasMoreBlogs) {
      setBlogPage(prev => prev + 1);
      fetchBlogs(blogPage + 1);
    }
  };

  if (error && activeTab === 'shorts') {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => fetchShorts()}
          className="px-4 py-2 bg-[#FF6B4A] text-white rounded-lg hover:bg-[#FF6B4A]/90"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Tabs */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('shorts')}
              className={`text-2xl font-bold pb-2 border-b-2 transition-colors ${
                activeTab === 'shorts' ? 'border-[#FF6B4A] text-[#FF6B4A]' : 'border-transparent'
              }`}
            >
              Fashion Shorts
            </button>
            <button
              onClick={() => setActiveTab('blogs')}
              className={`text-2xl font-bold pb-2 border-b-2 transition-colors ${
                activeTab === 'blogs' ? 'border-[#FF6B4A] text-[#FF6B4A]' : 'border-transparent'
              }`}
            >
              Fashion Blogs
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
              <HiOutlineFilter className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
              <HiOutlineChartBar className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'shorts' ? (
          // Existing Shorts Content
          <motion.div
            key="shorts"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Shorts Grid */}
            <InfiniteScroll
              dataLength={videos?.length || 0}
              next={loadMoreShorts}
              hasMore={!!nextPageToken}
              loader={
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={`skeleton-${i}`} 
                      className="aspect-[9/16] bg-gray-200 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              }
              endMessage={
                <p className="text-center text-gray-500 mt-8">
                  No more fashion shorts to load!
                </p>
              }
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <AnimatePresence mode="popLayout">
                  {Array.isArray(videos) && videos.map((video, index) => (
                    <motion.div
                      key={`video-${video.id}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="aspect-[9/16]"
                    >
                      <FashionShort video={video} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </InfiniteScroll>

            {/* Initial Loading State */}
            {loading && videos.length === 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => (
                  <div 
                    key={`initial-skeleton-${i}`} 
                    className="aspect-[9/16] bg-gray-200 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          // Blogs Content
          <motion.div
            key="blogs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <InfiniteScroll
              dataLength={blogs.length}
              next={loadMoreBlogs}
              hasMore={hasMoreBlogs}
              loader={<BlogSkeleton />}
              endMessage={
                <p className="text-center text-gray-500 mt-8">
                  You've seen all the latest fashion blogs!
                </p>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog, index) => (
                  <BlogCard key={`${blog.id}-${index}`} blog={blog} />
                ))}
              </div>
            </InfiniteScroll>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BlogCard({ blog }) {
  return (
    <motion.a
      href={blog.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="aspect-[16/9] overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <img
            src={blog.author.avatar}
            alt={blog.author.name}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-gray-600">{blog.author.name}</span>
          <span className="text-sm text-gray-400">• {blog.date}</span>
        </div>
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{blog.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-3">{blog.excerpt}</p>
        <div className="flex gap-2 mt-3">
          {blog.categories.slice(0, 3).map((category, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600"
            >
              {category}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}

function BlogSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-xl bg-white shadow-lg overflow-hidden">
          <div className="aspect-[16/9] bg-gray-200 animate-pulse" />
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
              <div className="w-24 h-4 bg-gray-200 animate-pulse rounded" />
            </div>
            <div className="w-full h-6 bg-gray-200 animate-pulse rounded mb-2" />
            <div className="w-3/4 h-4 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  );
} 