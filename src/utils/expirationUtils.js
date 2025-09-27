// Expiration management utilities for ClipShare

/**
 * Available expiration options
 */
export const EXPIRY_OPTIONS = [
  { value: 1, label: '1 Hour', description: 'Perfect for quick sharing' },
  { value: 4, label: '4 Hours', description: 'Short-term collaboration' },
  { value: 24, label: '24 Hours', description: 'Default option' },
  { value: 168, label: '7 Days', description: 'Extended sharing' },
];

/**
 * Calculate expiration timestamp based on hours
 * @param {number} hours - Hours from now until expiration
 * @returns {string} - ISO timestamp string
 */
export const calculateExpiryTime = (hours = 24) => {
  const now = new Date();
  const expiryTime = new Date(now.getTime() + (hours * 60 * 60 * 1000));
  return expiryTime.toISOString();
};

/**
 * Check if a file has expired
 * @param {string} expiresAt - ISO timestamp string
 * @returns {boolean} - Whether file has expired
 */
export const isExpired = (expiresAt) => {
  if (!expiresAt) return false;
  
  const now = new Date();
  const expiry = new Date(expiresAt);
  return now > expiry;
};

/**
 * Get time remaining until expiration
 * @param {string} expiresAt - ISO timestamp string
 * @returns {object} - Object with remaining time details
 */
export const getTimeRemaining = (expiresAt) => {
  if (!expiresAt) {
    return { expired: true, timeString: 'Expired' };
  }
  
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = expiry.getTime() - now.getTime();
  
  if (diff <= 0) {
    return { expired: true, timeString: 'Expired' };
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return { expired: false, timeString: `${days}d ${hours}h` };
  } else if (hours > 0) {
    return { expired: false, timeString: `${hours}h ${minutes}m` };
  } else {
    return { expired: false, timeString: `${minutes}m` };
  }
};

/**
 * Format expiry time for display
 * @param {string} expiresAt - ISO timestamp string
 * @returns {string} - Formatted date string
 */
export const formatExpiryDate = (expiresAt) => {
  if (!expiresAt) return 'Never expires';
  
  const date = new Date(expiresAt);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Get expiry option by value
 * @param {number} hours - Number of hours
 * @returns {object|null} - Expiry option object or null
 */
export const getExpiryOption = (hours) => {
  return EXPIRY_OPTIONS.find(option => option.value === hours) || null;
};

/**
 * Clean up expired files (utility for backend cleanup jobs)
 * @param {Array} files - Array of file objects with expires_at property
 * @returns {Array} - Array of expired file IDs
 */
export const getExpiredFileIds = (files) => {
  const now = new Date();
  return files
    .filter(file => file.expires_at && new Date(file.expires_at) < now)
    .map(file => file.id);
};