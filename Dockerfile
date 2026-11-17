FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY . /usr/share/nginx/html

# Keep build files out of the public web root.
RUN rm -f /usr/share/nginx/html/Dockerfile \
          /usr/share/nginx/html/nginx.conf \
          /usr/share/nginx/html/.dockerignore \
    && mkdir -p /tmp/nginx-cache/client_body \
                /tmp/nginx-cache/proxy \
                /tmp/nginx-cache/fastcgi \
                /tmp/nginx-cache/uwsgi \
                /tmp/nginx-cache/scgi

EXPOSE 8080
STOPSIGNAL SIGQUIT
CMD ["nginx", "-g", "daemon off;"]
