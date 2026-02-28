FROM php:8.2-fpm-alpine
RUN docker-php-ext-install pdo pdo_mysql
COPY backend /var/www/html/backend
WORKDIR /var/www/html/backend
