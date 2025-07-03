FROM node:22-bookworm AS build
WORKDIR /app
ENV ASTRO_TELEMETRY_DISABLED=1
COPY . .
RUN corepack enable && \
    pnpm install --frozen-lockfile && \
    pnpm run build

FROM node:22-bookworm AS runtime
WORKDIR /app
ENV ASTRO_TELEMETRY_DISABLED=1

ENV NGINX_VERSION   1.27.0
ENV NJS_VERSION     0.8.4
ENV NJS_RELEASE     2~bookworm
ENV PKG_RELEASE     2~bookworm
RUN apt-key adv --keyserver "hkp://keyserver.ubuntu.com:80" --keyserver-options timeout=10 --recv-keys 573BFD6B3D8FBC641079A6ABABF5BD827BD9BF62 && \
    echo "deb https://nginx.org/packages/mainline/debian/ bookworm nginx" >> /etc/apt/sources.list.d/nginx.list  && \
    apt-get update && \
    apt-get install --no-install-recommends --no-install-suggests -y \
      nginx=${NGINX_VERSION}-${PKG_RELEASE} \
      nginx-module-xslt=${NGINX_VERSION}-${PKG_RELEASE} \
      nginx-module-geoip=${NGINX_VERSION}-${PKG_RELEASE} \
      nginx-module-image-filter=${NGINX_VERSION}-${PKG_RELEASE} \
      nginx-module-njs=${NGINX_VERSION}+${NJS_VERSION}-${PKG_RELEASE} \
      gettext-base \
      curl && \
    apt-get remove --purge --auto-remove -y && rm -rf /var/lib/apt/lists/* /etc/apt/sources.list.d/nginx.list && \
    ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log

# nodejs app host and port
ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 80
CMD /run.sh

ADD run.sh /run.sh
ADD nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
