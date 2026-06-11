// ==========================================
// TRINETRA BACKEND - Shared ID Generator Utility
// Crypto-grade unique ID generation for all entities
// ==========================================
import crypto from 'crypto';

/**
 * Generate a crypto-grade unique ID with a given prefix.
 * @param {string} prefix - The prefix for the ID (e.g., 'TRN', 'POST', 'GROUP', 'TRN-TXN')
 * @param {number} byteLength - Number of random bytes (default: 4)
 * @returns {string} Formatted ID like "PREFIX-A1B2C3D4"
 */
export const generateId = (prefix = 'TRN', byteLength = 4) => {
  return `${prefix}-${crypto.randomBytes(byteLength).toString('hex').toUpperCase()}`;
};

export const generateTriNetraId = () => generateId('TRN', 4);
export const generatePostId = () => generateId('POST', 6);
export const generateGroupId = () => generateId('GROUP', 4);
export const generateTransactionId = () => generateId('TRN-TXN', 6);
