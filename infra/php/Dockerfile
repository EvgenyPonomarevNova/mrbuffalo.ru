FROM php:8.3-apache-bookworm
RUN apt-get update && apt-get install -y --no-install-recommends \
    libfreetype6-dev libjpeg62-turbo-dev libpng-dev libicu-dev libzip-dev libonig-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j2 mysqli pdo_mysql mbstring intl gd zip opcache exif bcmath sockets \
    && a2enmod rewrite expires headers \
    && rm -rf /var/lib/apt/lists/*
COPY local.ini /usr/local/etc/php/conf.d/zz-mrbuffalo.ini
COPY site.conf /etc/apache2/sites-available/000-default.conf
COPY bootstrap.php /usr/src/mrbuffalo/index.php
COPY entrypoint.sh /usr/local/bin/mrbuffalo-entrypoint
RUN chmod +x /usr/local/bin/mrbuffalo-entrypoint
ENTRYPOINT ["mrbuffalo-entrypoint"]
CMD ["apache2-foreground"]
