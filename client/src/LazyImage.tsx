import React, { useState } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Classes for the wrapper box (size it here, e.g. "aspect-[16/10] w-full") */
  wrapperClassName?: string;
  /** Used if the main image fails to load */
  fallbackSrc?: string;
}

/**
 * Image that only downloads when it is about to scroll into view (native lazy loading),
 * shows a shimmering skeleton while loading, then fades in.
 */
export const LazyImage: React.FC<LazyImageProps> = ({
  wrapperClassName = '',
  className = '',
  fallbackSrc,
  onLoad,
  onError,
  ...img
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {!loaded && <div aria-hidden="true" className="skeleton absolute inset-0 rounded-none" />}
      <img
        loading="lazy"
        decoding="async"
        {...img}
        className={`${className} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        onError={(e) => {
          if (fallbackSrc && e.currentTarget.src !== fallbackSrc) {
            e.currentTarget.src = fallbackSrc;
          } else {
            setLoaded(true); // stop the shimmer even if nothing loads
          }
          onError?.(e);
        }}
      />
    </div>
  );
};
