// src/cache/cache.manager.js
import config from "../config/cache.config.js";
import MemoryCache from "./drivers/memory.cache.js";
import RedisCache from "./drivers/redis.cache.js";
// import KVCache from './drivers/kv.cache.js'; // Lo añadirías en el futuro

let cacheClient;

switch (config.driver) {
  case "redis":
    cacheClient = new RedisCache(config.redis);
    break;
  // case 'kv':
  //   cacheClient = new KVCache(config.kv);
  //   break;
  default:
    console.log("Usando caché en memoria para desarrollo.");
    cacheClient = new MemoryCache();
}

export default cacheClient;
