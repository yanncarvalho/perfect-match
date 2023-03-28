# Base
FROM node:19-alpine as base-stage
COPY . .
RUN npm install

# Build
FROM node:19-alpine as build-stage
WORKDIR /app
COPY --from=base-stage . .
RUN npm run build --prod

# Production
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
