// src/config/cache.config.js
import dotenv from 'dotenv';
dotenv.config();

export default {
  // Elige tu driver: 'redis', 'kv', o 'memory' (para desarrollo)
  driver: process.env.CACHE_DRIVER || 'memory', 
  
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || null,
  },

  kv: {
    // Aquí irían las credenciales o configuraciones para Workers KV
    // Por ejemplo:
    // accountId: process.env.KV_ACCOUNT_ID,
    // namespaceId: process.env.KV_NAMESPACE_ID,
    // apiToken: process.env.KV_API_TOKEN,
  }
};
