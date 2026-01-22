FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p /usr/share/GeoIP
COPY geoip-data/GeoLite2-City.mmdb /usr/share/GeoIP/GeoLite2-City.mmdb

EXPOSE 3000

CMD ["npm", "start"]