# Etapa 2: Configuración del servidor Node.js y preparación de la aplicación
FROM node:18 AS production

# Establecer el directorio de trabajo para la aplicación
WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . /app/backend
# COPY . .

# Copiar el package.json y package-lock.json o yarn.lock del backend
COPY package*.json ./

# Instalar dependencias del backend
RUN npm install

# Copiar el código fuente del servidor Node.js
COPY . /app/backend

EXPOSE 3000

# Especificar el comando para correr el servidor
CMD ["npm", "run", "dev", "--prefix", "backend"]