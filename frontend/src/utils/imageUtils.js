/**
 * Helper to get optimized image URLs for high performance loading
 * @param {string} url Image URL
 * @param {number} width Desired display width (default 400px)
 * @returns {string} Optimized URL
 */
export const getOptimizedImageUrl = (url, width = 400) => {
  if (!url || typeof url !== 'string') {
    return '/images/hero.jpg';
  }

  // Cloudinary optimization
  if (url.includes('res.cloudinary.com')) {
    return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
  }

  // Unsplash optimization
  if (url.includes('images.unsplash.com')) {
    const hasQuery = url.includes('?');
    const params = `w=${width}&q=80&auto=format`;
    return hasQuery ? `${url}&${params}` : `${url}?${params}`;
  }

  return url;
};
