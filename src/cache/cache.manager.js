import config from "../config/cache.config.js";
import MemoryCache from "./drivers/memory.cache.js";
import RedisCache from "./drivers/redis.cache.js";d
import createLogger from "../logger.js";

const logger = createLogger("cache.manager.js");
let cacheClient;

logger.info(`Inicializando manejador de caché. Driver seleccionado: ${config.driver}`);

switch (config.driver) {
  case "redis":
    logger.info("Usando driver de caché: Redis");
    cacheClient = new RedisCache(config.redis);
    break;
  default:
    logger.warn("Driver no reconocido o 'default'. Usando caché en memoria (MemoryCache).");
    cacheClient = new MemoryCache();
}

export default cacheClient;