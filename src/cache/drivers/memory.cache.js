export default class MemoryCache {
  constructor() {
    this.cache = new Map();
  }

  async get(key) {
    return this.cache.get(key) || null;
  }

  async set(key, value, ttl_seconds) {
    this.cache.set(key, value);
    if (ttl_seconds) {
      setTimeout(() => {
        this.cache.delete(key);
      }, ttl_seconds * 1000);
    }
  }

  async del(key) {
    this.cache.delete(key);
  }
}
