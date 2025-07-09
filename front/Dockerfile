FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration=production

FROM nginx:alpine
ARG ENVIRONMENT
COPY --from=build /app/dist/front/browser /usr/share/nginx/html
COPY ./nginx.${ENVIRONMENT}.conf /etc/nginx/conf.d/default.conf
