// Password utilities for ClipShare
import bcrypt from 'bcryptjs';

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
export const hashPassword = async (password) => {
  if (!password || password.trim().length === 0) {
    return null;
  }
  
  const saltRounds = 12; // High security level
  return await bcrypt.hash(password.trim(), saltRounds);
};

/**
 * Verify a password against its hash
 * @param {string} password - Plain text password
 * @param {string} hash - Stored password hash
 * @returns {Promise<boolean>} - Whether password matches
 */
export const verifyPassword = async (password, hash) => {
  if (!password || !hash) {
    return false;
  }
  
  try {
    return await bcrypt.compare(password.trim(), hash);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
};

/**
 * Generate a secure random password
 * @param {number} length - Password length (default: 12)
 * @returns {string} - Generated password
 */
export const generatePassword = (length = 12) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return password;
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with isValid and message
 */
export const validatePasswordStrength = (password) => {
  if (!password) {
    return { isValid: true, message: 'No password required' };
  }
  
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  
  if (password.length > 128) {
    return { isValid: false, message: 'Password must be less than 128 characters' };
  }
  
  return { isValid: true, message: 'Password is valid' };
};