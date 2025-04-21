import React, { useState } from 'react';
import ReactPlayer from 'react-player';

const BlogPostCard = ({ post }) => {
  const { title, media = [], desc } = post;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/blog`;

    if (navigator.share) {
      navigator
        .share({
          title: 'Yoga by Nandini – Blog',
          text: 'Check out the blog posts!',
          url: shareUrl,
        })
        .catch((err) => console.error('Sharing failed:', err));
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Blog link copied to clipboard!');
      });
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  return (
    <article className="max-w-2xl mx-auto mb-20 font-sans text-[#111]">
      {/* Media Carousel */}
{media.length > 0 && (
  <div className="relative mb-6 overflow-hidden rounded-lg shadow-sm">
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

    {/* Navigation Buttons only if more than one media item */}
    {media.length > 1 && (
  <>
    <button
      onClick={handlePrev}
      className="absolute top-1/2 left-2 -translate-y-1/2 text-white hover:text-[#a15e7c] transition-transform duration-300 ease-in-out p-2 sm:p-3"
      aria-label="Previous"
    >
      <span className="text-xl sm:text-2xl font-extrabold hover:scale-110 transform transition-transform duration-200">
        &#8592;
      </span>
    </button>

    <button
      onClick={handleNext}
      className="absolute top-1/2 right-2 -translate-y-1/2 text-white hover:text-[#a15e7c] transition-transform duration-300 ease-in-out p-2 sm:p-3"
      aria-label="Next"
    >
      <span className="text-xl sm:text-2xl font-extrabold hover:scale-110 transform transition-transform duration-200">
        &#8594;
      </span>
    </button>
  </>
)}


  </div>
)}


      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-semibold mb-2 text-[#5e3c58] leading-snug">
  {title}
</h2>
      {/* Time */}
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
      <p className="text-base sm:text-lg text-[#333] leading-relaxed whitespace-pre-line mb-6">
        {desc}
      </p>

      {/* Share Button */}
      <button
        onClick={handleShare}
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
