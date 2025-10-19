/*export const HOST = "127.0.0.1";
export const USER = "root";
export const PASSWORD = "root";
export const DB = "clarisadb";
export const dialect = "mariadb";
export const PORTDB = PORT;
export const pool = {
  max: 5,
  min: 0,
  acquire: 30000,
  idle: 10000
  };*/
  
  
export const DB = "referidos_clarisa_cloud";   // nombre de la base de datos que creaste
export const USER = "root";                    // usuario de la BD (o el que tengas en HeidiSQL)
export const PASSWORD = "root123";       // la contraseña que uses en MariaDB
export const HOST = "127.0.0.1";               // localhost
const PORT = process.env.DB_PORT || 3307; // Puerto de MariaDB
export const dialect = "mariadb";              // muy importante
export const PORTDB = PORT;                      // porque MySQL usa 3306, tú configuraste MariaDB en 3307
export const pool = {
  max: 5,
  min: 0,
  acquire: 30000,
  idle: 10000
};


