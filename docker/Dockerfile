FROM nginx:1.17.4

VOLUME /webtax/html/

COPY ./dist/ /webtax/html/
COPY ./docker/nginx-admin.conf /etc/nginx/conf.d/
RUN rm /etc/nginx/conf.d/default.conf

RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
&& echo 'Asia/Shanghai' >/etc/timezone

ENTRYPOINT ["nginx", "-g", "daemon off;"]
