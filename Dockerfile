FROM node:20-slim AS base
WORKDIR /app
COPY package*.json ./

FROM base AS build
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
