FROM node:20-alpine AS build
WORKDIR /app

# Ustawienie zmiennej środowiskowej dla aplikacji React
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

COPY package*.json ./
RUN npm install

COPY . .

# Budowanie wersji produkcyjnej
RUN npm run build

# Serwowanie przez Nginx
FROM nginx:alpine

# Konfiguracja Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]