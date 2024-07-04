# Etapa 2: Configuración del servidor Node.js y preparación de la aplicación
FROM node:18 AS production

WORKDIR /app

RUN apt-get update && apt-get install -y iputils-ping

COPY package*.json ./

RUN npm install

COPY . /app/backend

EXPOSE 3000

CMD ["npm", "run", "dev", "--prefix", "backend"]