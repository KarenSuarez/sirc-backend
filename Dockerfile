# Etapa 1: Usar una imagen oficial de Node.js como base.
# Usamos la versión 'alpine' por ser más ligera.
FROM node:20-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json al directorio de trabajo
# El asterisco asegura que ambos archivos sean copiados si existen.
COPY package*.json ./

# Instalar solo las dependencias de producción listadas en package.json
RUN npm install --omit=dev

# Copiar el resto del código fuente de la aplicación al directorio de trabajo
# Esto respeta las reglas definidas en el archivo .dockerignore
COPY . .

# Crear un usuario y grupo no-root para ejecutar la aplicación por seguridad
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Cambiar al usuario no-root
USER appuser

# Exponer el puerto en el que la aplicación se ejecuta dentro del contenedor
EXPOSE 5000

# Comando para iniciar la aplicación cuando el contenedor se inicie
CMD [ "npm", "run", "dev" ]
