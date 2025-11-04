# sirc-backend

Sistemas de Fidelizacion y Referidos Clarisa CLOUD

## Instalación

1.  Clona el repositorio.
2.  Instala las dependencias:

```bash
npm install
```

o tambien con

```
npm i
```

## Uso

Para iniciar el servidor en modo de desarrollo, ejecuta:

```bash
npm run dev
```

Con el comando dev, aplicaremos el los env files para manejar el puerto de la base de datos, el --watch indica ejecutar el programa y reiniciarse en cada actualización al guardarse

```json
  "dev": "node --env-file=.env.dev --watch src/index.js"
```

## Endpoints

### Autenticación

- **POST /api/auth/register**

  Registra un nuevo usuario.

  **Body:**

  ```json
  {
    "nombre": "John",
    "apellido": "Doe",
    "correo_electronico": "john.doe@example.com",
    "password": "secretpassword",
    "numero_documento_identidad": "123456789",
    "id_tipo_documento": 1,
    "telefono": "1234567890"
  }
  ```

  **Respuesta:**

  ```json
  {
    "message": "¡Usuario registrado exitosamente!"
  }
  ```

## El back realiza el siguiente proceso

ejecuta el index.js que está al inicio del src

En ese archivo se crea el app de express, con middlewares para json, cors, etc

Se hace la sincronización con alter:true, que eso modifica si encuentra cambios
pero mantiene los datos
luego llama a initializeData, que es una clase dentro de utils para cargar datos iniciales, que 
en el front estan, los planes, los niveles, tipos de documento y roles
luego se configura el swagger para la documentación
extrae los datos del controllers, de routes y una clase de configs que carga algunos schemas

La documentación se encuentra en localhost:5000/api-docs
abajo hay un get, donde guardamos datos quemados para hacer pruebas

```bash
localhost:5000/storeReferidos
```
que carga 10 referidos, pero para ello es importante, debemos tener un usuario referente con el 
documento de id que sea un "1"y uno que sea "12" ya registrado
usuarios que se registran al hacer petición POST al siguiente url 
```bash
localhost:5000/api/auth/register
```
con el numero 1
  ```json
{
  "nombre": "John",
  "apellido": "Doe",
  "correo_electronico": "doeee1@example.com",
  "password": "12",
  "numero_documento_identidad": "1",
  "id_tipo_documento": 1,
  "telefono": "1234567890"
}
  ```
con el numero 12
```json
{
  "nombre": "John",
  "apellido": "Doe",
  "correo_electronico": "doeee1212@example.com",
  "password": "12",
  "numero_documento_identidad": "12",
  "id_tipo_documento": 1,
  "telefono": "1234567890"
}
```
Para hacer pruebas, se pueden agregar usuarios con roles de la siguiente manera
```json
{
  "nombre": "John",
  "apellido": "Doe",
  "correo_electronico": "d1@example.com",
  "password": "12",
  "numero_documento_identidad": "13",
  "id_tipo_documento": 1,
  "telefono": "1234567890",
  "roles":["admin", "referente"]
}
```
los roles estan como "admin", "referente", "gerente", "contador"
Todas las peticiones empiezan despues del siguiente endpoint localhost:5000/api/*
Por ejemplo el login es este
```bash
localhost:5000/api/auth/login POST 
```
```json
{
    "numero_documento_identidad":"13",
    "password":"12"
}
```
Luego de los logins exporta el token y ese token se guarda en el header x-access-token 
El token es un jwt que en el payload va lo siguiente 

las rutas se encuentran de la siguiente manera
dentro del index.routes.js
esta la parte del url donde luego redirige a las especificas rutas
para el login esta dentro de auth.routes.js que en el index indicamos las rutas de esta manera
```bash
router.use('/auth', authRoutes);
```
osea son los
```bash
localhost:5000/api/auth/****
```
dentro de cada *****.routes.js
estan las rutas 
está /register con el metodo post

/logout

/login

/logoutbyid

en cada archivo de los routes se encuentran las rutas especificas despues del sufijo

/points

/niveles
por ejemplo

en los archivos routes, van los middlewares para saber cuales validaciones hacen falta
```javascript
router.post("/", 
[authJwt.verifyToken , authJwt.hasRole('admin')],
 crearBeneficio);
```
 
 aqui por ejemplo el authjwt es un middleware que valida que exista el token y lo verifica, el segundo verifica el rol
 el rol viene de dentro del token de la sesion como un id
```json
"documento_id": "15",
"rls_id": [1,3]
```
este es el payload del jwt 
el documento y los rls_id que es un arreglo de los id de los roles

Los rate limiters ahora están configurados para proteger:

Login: 5 intentos cada 15 minutos por IP
Registro: 3 registros por hora por IP
Logout: 10 intentos cada 5 minutos
Verificación de token: 100 verificaciones por minuto (solo para tokens inválidos)
Intentos fallidos: Bloqueo temporal después de 5 intentos fallidos consecutivos