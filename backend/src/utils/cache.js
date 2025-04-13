const NodeCache = require('node-cache');

// Create cache instance with standard TTL of 10 minutes and check period of 600 seconds
const cache = new NodeCache({
  stdTTL: 600,
  checkperiod: 600,
  useClones: false
});

// Create the cache middleware instance
const createCacheMiddleware = (duration = 300) => {
  const middleware = (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `__express__${req.originalUrl || req.url}`;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    // Store the original json function
    const originalJson = res.json;

    // Override res.json method
    res.json = function(body) {
      // Store the response in cache
      cache.set(key, body, duration);
      
      // Call the original json function
      return originalJson.call(this, body);
    };

    next();
  };

  return middleware;
};

// Function to clear cache for specific patterns
const clearCache = (pattern) => {
  const keys = cache.keys();
  const matchingKeys = keys.filter(key => key.includes(pattern));
  matchingKeys.forEach(key => cache.del(key));
};

// Export the middleware factory and helper functions
module.exports = {
  cache,
  cacheMiddleware: createCacheMiddleware,
  clearCache
};
