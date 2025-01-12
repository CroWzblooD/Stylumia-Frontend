import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlay, HiPause, HiVolumeUp, HiVolumeOff, HiHeart, HiShare, 
         HiOutlineExternalLink, HiOutlineClock, HiOutlineEye, HiOutlineThumbUp,
         HiOutlineHashtag, HiOutlineChat, HiOutlineBookmark } from 'react-icons/hi';

export const FashionShort = ({ video }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const iframeRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Pre-load the iframe
    if (iframeRef.current) {
      iframeRef.current.src = video.videoUrl;
      // Small delay to ensure smooth transition
      timeoutRef.current = setTimeout(() => {
        setIsVideoLoaded(true);
      }, 200);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsVideoLoaded(false);
    if (iframeRef.current) {
      iframeRef.current.src = '';
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Extract hashtags from title
  const hashtags = video.title
    .split(' ')
    .filter(word => word.startsWith('#'))
    .slice(0, 3);

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-xl overflow-hidden bg-black/90 shadow-lg group h-full"
    >
      <div className="relative w-full h-full">
        {/* Thumbnail/Video Layer */}
        <motion.img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
          animate={{ opacity: isVideoLoaded ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Video Iframe */}
        <div className={`absolute inset-0 transition-opacity duration-300 ${
          isVideoLoaded ? 'opacity-100' : 'opacity-0'
        }`}>
          <iframe
            ref={iframeRef}
            className="w-full h-full"
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Info Overlay */}
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90
            flex flex-col justify-between p-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Top Section */}
          <div className="space-y-2">
            {/* Channel Info */}
            <div className="flex items-center gap-2">
              <img 
                src={video.channelThumbnail}
                alt={video.channelTitle}
                className="w-8 h-8 rounded-full border-2 border-white/50"
              />
              <div>
                <h4 className="text-white font-medium text-sm">{video.channelTitle}</h4>
                <div className="flex items-center gap-2 text-xs text-white/80">
                  <HiOutlineClock className="w-3 h-3" />
                  {video.publishedAt}
                </div>
              </div>
            </div>

            {/* Hashtags */}
            <div className="flex flex-wrap gap-2">
              {hashtags.map((tag, index) => (
                <span 
                  key={index}
                  className="text-xs px-2 py-1 bg-white/20 text-white rounded-full backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="space-y-3">
            {/* Title */}
            <h3 className="text-white text-sm font-medium line-clamp-2">
              {video.title.replace(/#\w+/g, '')}
            </h3>

            {/* Stats Row */}
            <div className="flex items-center justify-between text-white/90 text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <HiOutlineEye className="w-4 h-4" />
                  {video.views}
                </div>
                <div className="flex items-center gap-1">
                  <HiOutlineThumbUp className="w-4 h-4" />
                  {video.likes}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLiked(!isLiked);
                  }}
                  className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                    isLiked ? 'bg-red-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <HiHeart className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSaved(!isSaved);
                  }}
                  className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                    isSaved ? 'bg-blue-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <HiOutlineBookmark className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
                >
                  <HiShare className="w-5 h-5" />
                </motion.button>
              </div>

              <motion.a
                href={`https://youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-full bg-[#FF6B4A] text-white hover:bg-[#FF6B4A]/90 transition-colors"
              >
                <HiOutlineExternalLink className="w-5 h-5" />
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}; 