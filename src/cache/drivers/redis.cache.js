// src/cache/drivers/redis.cache.js
import { createClient } from 'redis';

export default class RedisCache {
  constructor(config) {
    this.client = createClient({
      password: config.password,
      socket: {
        host: config.host,
        port: config.port
      }
    });
    this.client.on('error', (err) => console.error('Redis Client Error', err));
    this.connect();
  }

  async connect() {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  async get(key) {
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key, value, ttl_seconds) {
    const stringValue = JSON.stringify(value);
    if (ttl_seconds) {
      await this.client.set(key, stringValue, { 'EX': ttl_seconds });
    } else {
      await this.client.set(key, stringValue);
    }
  }

  async del(key) {
    await this.client.del(key);
  }
}
