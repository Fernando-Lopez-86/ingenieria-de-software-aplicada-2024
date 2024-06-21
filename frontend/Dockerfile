# Etapa 1: Construcción de la aplicación React
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

#FROM nginx:alpine

#COPY --from=build /app/build /usr/share/nginx/html
#COPY --from=build /app/build ./frontend/build

RUN npm install -g serve

EXPOSE 3001

#CMD ["npm", "start"]
CMD ["serve", "-s", "build", "-l", "3001"]