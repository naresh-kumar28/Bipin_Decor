import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function CategoryCard({ category }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);

  // Safety check: if category is missing, don't render
  if (!category || Object.keys(category).length === 0) return null;

  // Helper to ensure image URL is absolute
  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const baseUrl = 'http://localhost:8000'; // Adjust if needed
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  // Combine main image with project images for the carousel, with safety filtering and de-duplication
  const displayImages = Array.from(new Set([
    category.image,
    ...(Array.isArray(category.project_images) ? category.project_images : [])
  ]))
  .filter(img => typeof img === 'string' && img.trim() !== '')
  .map(img => getImageUrl(img));

  useEffect(() => {
    if (isHovered && displayImages.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
      }, 2000); 
    } else {
      clearInterval(intervalRef.current);
      setCurrentImageIndex(0);
    }

    return () => clearInterval(intervalRef.current);
  }, [isHovered, displayImages.length]);

  return (
    <Link 
      to={`/portfolio?category=${category.slug || ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group/card block relative w-[280px] md:w-[360px] h-[280px] md:h-[360px] rounded-2xl overflow-hidden snap-start shrink-0 cursor-pointer transition-all duration-500 shadow-lg hover:shadow-2xl bg-muted"
    >
      {/* Dynamic Image Container */}
      <div className="absolute inset-0 w-full h-full">
        {displayImages.length > 0 ? (
          displayImages.map((img, idx) => (
            <img 
              key={idx}
              src={img}
              alt={`${category.name || 'Category'} ${idx}`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 transform z-0
                ${idx === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}
                ${isHovered ? 'scale-105' : 'scale-100'}
              `}
              onError={(e) => {
                console.error('Image load error:', img);
                e.target.style.display = 'none';
              }}
            />
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <iconify-icon icon="lucide:grid-3x3" class="text-4xl text-primary/30"></iconify-icon>
          </div>
        )}
      </div>

      {/* Progress Indicators (Only show on hover) */}
      {isHovered && displayImages.length > 1 && (
        <div className="absolute top-4 left-6 right-6 z-30 flex gap-1.5">
          {displayImages.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'bg-primary' : 'bg-white/30'}`}
            ></div>
          ))}
        </div>
      )}

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 transition-opacity duration-500 pointer-events-none"></div>
      
      {/* Content */}
      <div className="absolute bottom-6 left-6 right-6 z-20 transition-transform duration-500 group-hover/card:-translate-y-2 pointer-events-none">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold text-primary-foreground bg-primary px-2 py-0.5 rounded-sm uppercase tracking-widest shadow-sm">
            {category.project_images?.length || 0} Projects
          </span>
        </div>
        <h3 className="text-white text-2xl font-heading font-bold mb-1.5 drop-shadow-md">{category.name || 'Unnamed Category'}</h3>
        <p className="text-white/90 text-sm flex items-center gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 translate-y-2 group-hover/card:translate-y-0">
          Explore Projects <iconify-icon icon="lucide:arrow-right" className="text-xs"></iconify-icon>
        </p>
      </div>

      {/* Decorative Border */}
      <div className="absolute inset-0 border border-white/10 group-hover/card:border-white/30 transition-colors duration-500 pointer-events-none rounded-2xl z-30"></div>
    </Link>
  );
}

export default CategoryCard;
