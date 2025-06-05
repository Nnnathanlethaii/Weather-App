// backend/cache.js
import NodeCache from 'node-cache';

const { CACHE_TTL = 600 } = process.env;
const cache = new NodeCache({ stdTTL: Number(CACHE_TTL), checkperiod: 120 });

/**
 * Generate a cache key string based on URL + params.
 * @param {string} endpoint
 * @param {object} params
 * @returns {string}
 */
function generateKey(endpoint, params) {
  // Sort keys so that order of params doesn't change the key
  const sorted = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
  return `${endpoint}?${sorted}`;
}

export function getCached(endpoint, params) {
  const key = generateKey(endpoint, params);
  return cache.get(key);
}

export function setCached(endpoint, params, data) {
  const key = generateKey(endpoint, params);
  cache.set(key, data);
}
