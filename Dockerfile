FROM node:14.2.0-alpine3.10 as build

RUN mkdir -p /usr/src/ctf-ui
WORKDIR /usr/src/ctf-ui

RUN apk update && apk add yarn

COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .

RUN yarn build

FROM nginx:1.17.10
COPY --from=build /usr/src/ctf-ui/build /usr/share/nginx/html
RUN chgrp -R root /var/cache/nginx /var/run /var/log/nginx && \
    chmod -R 770 /var/cache/nginx /var/run /var/log/nginx
RUN sed -i 's/80;/8080;/g' /etc/nginx/conf.d/default.conf 
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
