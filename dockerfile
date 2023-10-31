FROM node:20 AS build

WORKDIR /app
RUN npm install -g pnpm
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install
COPY . ./
RUN apt update && \
    apt install openssl -y && \
 openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
 -keyout nginx-selfsigned.key \
 -out nginx-selfsigned.crt\
  -subj "/C=AU/ST=Victoria/L=Melbourne/O=Ewan Dank/CN=hottest100.ewandank.xyz"
RUN pnpm run build

FROM nginx:stable-alpine-slim
COPY --from=build /app/nginx-selfsigned.crt /etc/nginx/ssl/nginx-selfsigned.crt
COPY --from=build /app/nginx-selfsigned.key /etc/nginx/ssl/nginx-selfsigned.key
COPY nginx.conf /etc/nginx/nginx.conf
RUN apk add --no-cache bash
WORKDIR /usr/share/nginx/html
COPY --from=build /app/build .
COPY create-env.sh .
COPY .env-example .env 
RUN chmod +x create-env.sh
EXPOSE 443
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/create-env.sh && nginx -g \"daemon off;\""]
