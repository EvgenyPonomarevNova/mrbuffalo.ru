#!/bin/sh
set -eu
if [ ! -f /var/www/html/index.php ] && [ ! -d /var/www/html/bitrix ]; then
    cp /usr/src/mrbuffalo/index.php /var/www/html/index.php
    chown www-data:www-data /var/www/html /var/www/html/index.php
fi
exec docker-php-entrypoint "$@"
