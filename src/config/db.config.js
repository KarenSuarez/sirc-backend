/*export const HOST = "127.0.0.1";
export const USER = "root";
export const PASSWORD = "root";
export const DB = "clarisadb";
export const dialect = "mariadb";

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
export const dialect = "mariadb";              // muy importante
export const PORT = 3307;                      // porque MySQL usa 3306, tú configuraste MariaDB en 3307

export const pool = {
  max: 5,
  min: 0,
  acquire: 30000,
  idle: 10000
};

