FROM node:14.2.0-alpine3.10 as build

RUN mkdir -p /usr/src/ctf-ui
WORKDIR /usr/src/ctf-ui

RUN apk update && apk add yarn

ARG ctf_api
ENV CTF_API=$ctf_api

RUN : "${ctf_api:?Build argument is required to be non-empty.}"

COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .

RUN yarn build

FROM nginx:1.17.10
COPY --from=build /usr/src/ctf-ui/build /usr/share/nginx/html
RUN chgrp -R root /var/cache/nginx /var/run /var/log/nginx && \
    chmod -R 770 /var/cache/nginx /var/run /var/log/nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf 
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
