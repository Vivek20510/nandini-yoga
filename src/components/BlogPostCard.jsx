import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Helmet } from 'react-helmet';

const BlogPostCard = ({ post }) => {
  const { id, title, media = [], desc } = post;
  const [currentIndex, setCurrentIndex] = useState(0);

  const startX = useRef(0);
  const isDragging = useRef(false);

  const handleStart = (e) => {
    isDragging.current = true;
    startX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };

  const handleEnd = (e) => {
    if (!isDragging.current) return;
    const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const diff = endX - startX.current;

    if (diff > 50) {
      handlePrev();
    } else if (diff < -50) {
      handleNext();
    }

    isDragging.current = false;
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/blog?id=${id}`;
  
    if (navigator.share) {
      navigator.share({
        title: 'Yoga by Nandini – Blog',
        text: 'Check out the blog post!',
        url: shareUrl,
      }).catch((error) => console.error('Sharing failed:', error));
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Blog link copied to clipboard!');
      }).catch((error) => {
        console.error('Failed to copy to clipboard:', error);
      });
    }
  };

  // Default image if no media is available
  const defaultImage = "https://your-website.com/default-og-image.jpg";
  const ogImage = media.length > 0 ? media[0].url : defaultImage;
  const blogUrl = `${window.location.origin}/blog?id=${id}`;

  return (
    <article className="max-w-2xl mx-auto mb-20 font-sans text-[#111]">
      
      {/* ✅ Dynamic Open Graph Meta Tags */}
      <Helmet>
        <title>{title ? `${title} | Yoga by Nandini` : 'Yoga by Nandini - Blog'}</title>
        <meta property="og:title" content={title || "Yoga by Nandini - Blog"} />
        <meta property="og:description" content={desc || "Explore yoga, wellness, and mindfulness tips."} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={blogUrl} />
        <meta property="og:type" content="article" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title || "Yoga by Nandini - Blog"} />
        <meta name="twitter:description" content={desc || "Explore yoga, wellness, and mindfulness tips."} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      {/* Media Carousel */}
      {media.length > 0 && (
        <div 
          className="relative mb-6 overflow-hidden rounded-lg shadow-sm"
          onTouchStart={handleStart}
          onTouchEnd={handleEnd}
          onMouseDown={handleStart}
          onMouseUp={handleEnd}
          onMouseLeave={() => (isDragging.current = false)}
        >
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {media.map((item, i) => (
              <div key={i} className="min-w-full">
                <div className="relative w-full aspect-video overflow-hidden rounded-lg">
                  {item.type === 'video' ? (
                    <ReactPlayer
                      url={item.url}
                      controls
                      width="100%"
                      height="100%"
                      className="absolute top-0 left-0"
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={`Media ${i + 1}`}
                      loading="lazy"
                      className="absolute top-0 left-0 w-full h-full object-contain"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Dots for Navigation */}
          {media.length > 1 && (
            <div className="flex justify-center mt-4 space-x-1">
              {media.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    currentIndex === index ? 'bg-[#8B3D6E]' : 'bg-gray-300'
                  }`}
                ></button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-semibold mb-2 text-[#5e3c58] leading-snug">{title}</h2>

      {/* Date */}
      {post.date && (
        <p className="text-[15px] text-[#856056] italic font-serif tracking-wide mb-4">
          {new Date(post.date.seconds * 1000).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      )}

      {/* Description */}
      <p className="text-base sm:text-lg text-[#333] leading-relaxed whitespace-pre-line mb-6">{desc}</p>

      {/* Share Button */}
      <button
        onClick={handleShare}
        className="inline-flex items-center text-sm font-medium text-[#a15e7c] hover:text-white border border-[#a15e7c] px-4 py-2 rounded-lg transition-all hover:bg-[#a15e7c] focus:outline-none focus:ring-2 focus:ring-[#e3c0cf] focus:ring-offset-2"
        title="Share this post"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4-4 4M12 2v14" />
        </svg>
        Share
      </button>
    </article>
  );
};

export default BlogPostCard;
