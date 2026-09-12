/**
 * Dynamic SVG Illustration generator for baby items
 */
export const createBabyItemSVG = (name = 'Organic Baby Essential', category = 'Baby Care') => {
  const cleanName = String(name).replace(/"/g, '&quot;').replace(/</g, '&lt;');
  
  let bgStart = '#E0F2FE';
  let bgEnd = '#BAE6FD';
  let accentColor = '#0284C7';
  let badgeBg = '#E0F2FE';
  let badgeText = '#0369A1';
  let iconPath = `<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="#0284C7"/>`;

  const catLower = String(category).toLowerCase();
  if (catLower.includes('walker')) {
    bgStart = '#E0F2FE'; bgEnd = '#BAE6FD'; accentColor = '#0284C7'; badgeBg = '#E0F2FE'; badgeText = '#0369A1';
  } else if (catLower.includes('furniture') || catLower.includes('crib')) {
    bgStart = '#FEF3C7'; bgEnd = '#FDE68A'; accentColor = '#D97706'; badgeBg = '#FEF3C7'; badgeText = '#B45309';
  } else if (catLower.includes('toy') || catLower.includes('learning')) {
    bgStart = '#FCE7F3'; bgEnd = '#FBCFE8'; accentColor = '#DB2777'; badgeBg = '#FCE7F3'; badgeText = '#BE185D';
  } else if (catLower.includes('stroller') || catLower.includes('travel')) {
    bgStart = '#E0E7FF'; bgEnd = '#C7D2FE'; accentColor = '#4F46E5'; badgeBg = '#E0E7FF'; badgeText = '#4338CA';
  } else if (catLower.includes('feeding')) {
    bgStart = '#D1FAE5'; bgEnd = '#A7F3D0'; accentColor = '#059669'; badgeBg = '#D1FAE5'; badgeText = '#047857';
  } else if (catLower.includes('apparel') || catLower.includes('clothing')) {
    bgStart = '#FFE4E6'; bgEnd = '#FECDD3'; accentColor = '#E11D48'; badgeBg = '#FFE4E6'; badgeText = '#BE123C';
  } else if (catLower.includes('bath') || catLower.includes('skincare')) {
    bgStart = '#F3E8FF'; bgEnd = '#E9D5FF'; accentColor = '#9333EA'; badgeBg = '#F3E8FF'; badgeText = '#7E22CE';
  } else if (catLower.includes('carrier')) {
    bgStart = '#FFEDD5'; bgEnd = '#FDBA74'; accentColor = '#EA580C'; badgeBg = '#FFEDD5'; badgeText = '#C2410C';
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" width="100%" height="100%">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgStart}" />
        <stop offset="100%" stop-color="${bgEnd}" />
      </linearGradient>
    </defs>
    <rect width="600" height="500" rx="28" fill="url(#bgGrad)" />
    <circle cx="300" cy="190" r="100" fill="#FFFFFF" opacity="0.95" />
    <circle cx="300" cy="190" r="78" fill="${badgeBg}" />
    
    <g transform="translate(252, 142) scale(2.0)">
      ${iconPath}
    </g>

    <rect x="170" y="310" width="260" height="36" rx="18" fill="${badgeBg}" />
    <text x="300" y="333" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="800" fill="${badgeText}" text-anchor="middle" letter-spacing="1">
      100% CERTIFIED SAFE &amp; ORGANIC
    </text>

    <text x="300" y="388" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="800" fill="#0F172A" text-anchor="middle">
      ${cleanName.length > 34 ? cleanName.slice(0, 32) + '...' : cleanName}
    </text>
    <text x="300" y="416" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#475569" text-anchor="middle">
      Pediatrician Approved • NK Enterprises
    </text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

/**
 * Helper to get optimized image URLs for high performance loading
 * @param {string} url Image URL
 * @param {number} width Desired display width (default 400px)
 * @param {string} productName Fallback product name
 * @param {string} categoryName Fallback category name
 * @returns {string} Optimized URL or dynamic SVG
 */
export const getOptimizedImageUrl = (url, width = 400, productName = '', categoryName = '') => {
  if (!url || typeof url !== 'string' || url.includes('photo-1519689680058-324335c77eba')) {
    return createBabyItemSVG(productName || 'Organic Baby Item', categoryName || 'Baby Care');
  }

  // Local /images/ static assets
  if (url.startsWith('/images/')) {
    return url;
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
