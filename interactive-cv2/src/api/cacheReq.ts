// cacheReq.ts
// This file contains a cache manager for API requests.
// Author: Thomas Gascoyne

// Cache implementation (can use memory, localStorage, etc.)
const cache: Record<string, any> = {};

/**
 * Cache manager
 * @type {{get: (key: string) => any | null, set: (key: string, value: any) => void, clear: (key: string) => void, clearAll: () => void}}
 * @property {function(key: string): any | null} get - Get a value from the cache
 * @property {function(key: string, value: any): void} set - Set a value in the cache
 * @property {function(key: string): void} clear - Clear a value from the cache
 * @property {function(): void} clearAll - Clear all values from the cache
 */
const cacheManager = {
  get: (key: string): any | null => {
    // Optionally use localStorage or sessionStorage
    return cache[key] || null;
  },
  set: (key: string, value: any): void => {
    cache[key] = value;
    // Optionally persist in localStorage or sessionStorage
    // localStorage.setItem(key, JSON.stringify(value));
  },
  clear: (key: string): void => {
    delete cache[key];
    // localStorage.removeItem(key);
  },
  clearAll: (): void => {
    Object.keys(cache).forEach(key => delete cache[key]);
    // localStorage.clear();
  }
};

// Export the cache manager
export default cacheManager;