<?php
declare(strict_types=1);
try {
    foreach (['mysqli', 'mbstring', 'intl', 'gd', 'zip', 'xml', 'curl', 'openssl', 'bcmath'] as $extension) {
        if (!extension_loaded($extension)) {
            throw new RuntimeException('Missing PHP extension: ' . $extension);
        }
    }
    $db = new mysqli(getenv('MYSQL_HOST'), getenv('MYSQL_USER'), getenv('MYSQL_PASSWORD'), getenv('MYSQL_DATABASE'));
    $db->query('SELECT 1');
    $socket = @fsockopen('127.0.0.1', 80, $errno, $error, 2);
    if (!$socket) {
        throw new RuntimeException('Apache is not listening');
    }
    fclose($socket);
    echo "PHP extensions, database and Apache: OK\n";
    echo is_file('/var/www/html/bitrix/modules/main/include.php') ? "Bitrix files: present (installation status not checked)\n" : "Bitrix files: not imported yet\n";
} catch (Throwable $error) {
    fwrite(STDERR, $error->getMessage() . "\n");
    exit(1);
}
