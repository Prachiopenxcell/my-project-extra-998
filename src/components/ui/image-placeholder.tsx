import React, { useState } from 'react';
import { ImageIcon } from 'lucide-react';

interface ImageWithPlaceholderProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  fallbackSrc?: string;
  width?: number;
  height?: number;
}

export const ImageWithPlaceholder: React.FC<ImageWithPlaceholderProps> = ({
  src,
  alt,
  className = '',
  placeholderClassName = '',
  fallbackSrc,
  width,
  height
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Generate a placeholder URL based on dimensions
  const getPlaceholderUrl = () => {
    if (fallbackSrc) return fallbackSrc;
    
    // Extract dimensions from className or use defaults
    const widthMatch = className.match(/w-(\d+)/);
    const heightMatch = className.match(/h-(\d+)/);
    
    const defaultWidth = width || (widthMatch ? parseInt(widthMatch[1]) * 4 : 400);
    const defaultHeight = height || (heightMatch ? parseInt(heightMatch[1]) * 4 : 300);
    
    return `https://via.placeholder.com/${defaultWidth}x${defaultHeight}/e2e8f0/64748b?text=${encodeURIComponent(alt || 'Image')}`;
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // If image failed to load, show placeholder
  if (imageError) {
    return (
      <div className={`bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center ${className} ${placeholderClassName}`}>
        <div className="text-center text-gray-500">
          <ImageIcon className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">image/video</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {imageLoading && (
        <div className={`bg-gray-100 animate-pulse flex items-center justify-center ${className}`}>
          <ImageIcon className="h-8 w-8 text-gray-400" />
        </div>
      )}
      <img
        src={src || getPlaceholderUrl()}
        alt={alt}
        className={`${className} ${imageLoading ? 'hidden' : ''}`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        width={width}
        height={height}
      />
    </>
  );
};

// Avatar component with placeholder
interface AvatarWithPlaceholderProps {
  src?: string;
  alt: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const AvatarWithPlaceholder: React.FC<AvatarWithPlaceholderProps> = ({
  src,
  alt,
  className = '',
  size = 'md'
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getPlaceholderUrl = () => {
    const initials = getInitials(alt);
    const sizeValue = sizeClasses[size as keyof typeof sizeClasses].includes('8') ? 32 : 
                      sizeClasses[size as keyof typeof sizeClasses].includes('10') ? 40 :
                      sizeClasses[size as keyof typeof sizeClasses].includes('12') ? 48 : 64;
    
    return `https://via.placeholder.com/${sizeValue}x${sizeValue}/3b82f6/ffffff?text=${initials}`;
  };

  if (!src || imageError) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-slate-600 flex items-center justify-center text-white font-medium ${className}`}>
        {getInitials(alt)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      onError={() => setImageError(true)}
    />
  );
};
