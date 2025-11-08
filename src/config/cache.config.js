import dotenv from "dotenv";
dotenv.config();

export default {
  driver: process.env.CACHE_DRIVER || "memory",
  redis: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || null,
  },
};
