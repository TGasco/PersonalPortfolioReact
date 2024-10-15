// cacheReq.js
// This file contains a cache manager for API requests.
// Author: Thomas Gascoyne

// Cache implementation (can use memory, localStorage, etc.)
const cache = {};

/**
 * Cache manager
 * @type {{get: (function(*): null), set: (function(*, *): void), clear: (function(*): void), clearAll: (function(): void)}}
 * @property {function(*): *} get - Get a value from the cache
 * @property {function(*, *): void} set - Set a value in the cache
 * @property {function(*): void} clear - Clear a value from the cache
 * @property {function(): void} clearAll - Clear all values from the cache
 */
const cacheManager = {
  get: (key) => {
    // Optionally use localStorage or sessionStorage
    return cache[key] || null;
  },
  set: (key, value) => {
    cache[key] = value;
    // Optionally persist in localStorage or sessionStorage
    // localStorage.setItem(key, JSON.stringify(value));
  },
  clear: (key) => {
    delete cache[key];
    // localStorage.removeItem(key);
  },
  clearAll: () => {
    Object.keys(cache).forEach(key => delete cache[key]);
    // localStorage.clear();
  }
};

// Export the cache manager
export default cacheManager;