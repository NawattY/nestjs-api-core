FROM node:18.8.0

RUN ln -sf /usr/share/zoneinfo/Asia/Bangkok /etc/localtime
RUN apt update && apt install git nano wget curl gettext-base net-tools nginx -y
RUN apt clean -y
RUN mkdir -p /data/vhosts/smart-restaurant-api/ 



WORKDIR /data/vhosts/smart-restaurant-api/

ADD ./.docker/run.bash /run.bash

COPY . .
RUN npm install pm2@latest -g

RUN rm -Rf .git
RUN npm install
RUN rm -f  /etc/nginx/sites-available/*
ADD ./.docker/default /etc/nginx/sites-available/default
RUN mkdir -p /var/www/html && touch /var/www/html/index.html

CMD ["/bin/bash", "/run.bash"]
