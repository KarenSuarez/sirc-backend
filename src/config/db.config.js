import dotenv from "dotenv";
dotenv.config();

export const HOST = process.env.DB_HOST || "127.0.0.1";
export const USER = process.env.DB_USER || "root";
export const PASSWORD = process.env.DB_PASSWORD || "root123";
export const DB = process.env.DB_NAME || "referidos_clarisa_cloud";
export const PORTDB = process.env.DB_PORT || 3306;
export const dialect = "mariadb";

export const pool = {
  max: 5,
  min: 0,
  acquire: 30000,
  idle: 10000,
};


