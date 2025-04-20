import React from 'react';
import ReactPlayer from 'react-player';

const BlogPostCard = ({ post }) => {
  const { title, url, type, desc } = post;

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/blog`;
  
    if (navigator.share) {
      navigator.share({
        title: 'Yoga by Nandini – Blog',
        text: 'Check out the blog posts!',
        url: shareUrl,
      }).catch((err) => console.error('Sharing failed:', err));
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Blog link copied to clipboard!');
      });
    }
  };
  

  return (
    <article className="max-w-2xl mx-auto mb-20 font-sans text-[#111]">
      {/* Media Block */}
      <div className="mb-6 rounded-lg overflow-hidden shadow-sm">
        {type === 'video' ? (
          <div className="relative w-full aspect-video">
            <ReactPlayer
              url={url}
              controls
              width="100%"
              height="100%"
              className="absolute top-0 left-0"
            />
          </div>
        ) : (
          <img
            src={url}
            alt={title || 'Yoga Post'}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        )}
      </div>

      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-[#5e3c58] leading-snug">
        {title}
      </h2>

      {/* Description */}
      <p className="text-base sm:text-lg text-[#333] leading-relaxed whitespace-pre-line mb-6">
        {desc}
      </p>

      {/* Share Button */}
      <button
        onClick={() => handleShare(post)}
        className="inline-flex items-center text-sm font-medium text-[#a15e7c] hover:text-white border border-[#a15e7c] px-4 py-2 rounded-lg transition-all hover:bg-[#a15e7c] focus:outline-none focus:ring-2 focus:ring-[#e3c0cf] focus:ring-offset-2"
        title="Share this post"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4-4 4M12 2v14" />
        </svg>
        Share
      </button>
    </article>
  );
};

export default BlogPostCard;
