FROM node:20 AS build

WORKDIR /app
RUN npm install -g pnpm
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install --production
# TODO: Scope this correctly 
COPY . ./ 
RUN pnpm run build

FROM nginx:stable-alpine-slim
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx-selfsigned.crt /etc/nginx/ssl/nginx-selfsigned.crt
COPY nginx-selfsigned.key /etc/nginx/ssl/nginx-selfsigned.key
COPY nginx.conf /etc/nginx/nginx.conf