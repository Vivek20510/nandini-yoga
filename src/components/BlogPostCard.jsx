import React from 'react';
import ReactPlayer from 'react-player';

const BlogPostCard = ({ post }) => {
  const { title, url, type, desc } = post;

  return (
    <article className="max-w-2xl mx-auto mb-20 font-sans text-[#111]">
      {/* Media */}
      <div className="mb-6">
        {type === 'video' ? (
          <div className="relative w-full aspect-video">
            <ReactPlayer
              url={url}
              controls
              width="100%"
              height="100%"
              className="absolute top-0 left-0 bg-transparent"  // Background color here
            />
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg">
            <img
              src={url}
              alt={title || 'Yoga Post'}
              className="w-full h-auto object-cover"
            />
          </div>
        )}
      </div>

      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-semibold mb-4 leading-snug">
        {title}
      </h2>

      {/* Description */}
      <p className="text-base sm:text-lg text-[#333] leading-relaxed whitespace-pre-line">
        {desc}
      </p>
    </article>
  );
};

export default BlogPostCard;
