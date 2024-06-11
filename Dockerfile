# Etapa 1: Construcción de la aplicación React
FROM node:18 AS build

# Establecer el directorio de trabajo en el contenedor para la construcción
WORKDIR /app

# Copiar el package.json y package-lock.json o yarn.lock de React
COPY frontend/package*.json ./frontend/

# Instalar dependencias del frontend
RUN cd frontend && npm install

# Copiar el código fuente de React
COPY frontend ./frontend

# Construir la aplicación React
RUN cd frontend && npm run build

# Etapa 2: Configuración del servidor Node.js y preparación de la aplicación
FROM node:18 AS production

# Establecer el directorio de trabajo para la aplicación
WORKDIR /app

# Copiar el package.json y package-lock.json o yarn.lock del backend
COPY backend/package*.json ./backend/

# Instalar dependencias del backend
RUN cd backend && npm install --production

# Copiar el código fuente del servidor Node.js
COPY backend ./backend

# Copiar los archivos estáticos de React desde la etapa de construcción
COPY --from=build /app/frontend/build ./frontend/build

# Exponer el puerto en el que la aplicación va a correr
EXPOSE 3000

# Especificar el comando para correr el servidor
CMD ["node", "backend/server.js"]