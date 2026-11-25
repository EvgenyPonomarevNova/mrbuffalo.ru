<?php declare(strict_types=1); ?>
<!doctype html>
<html lang="ru">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mr Buffalo — локальное окружение</title>
<h1>Mr Buffalo</h1>
<p>Локальное окружение готово. Дизайн и контент ожидают материалов заказчика.</p>
<p>Это техническая страница, не макет лендинга.</p>
<nav aria-label="Тестовые продукты"><ul>
<?php for ($number = 1; $number <= 8; $number++): ?>
<li><a href="http://product-<?= sprintf('%02d', $number) ?>.localhost:<?= (int) (getenv('LOCAL_HTTP_PORT') ?: 8088) ?>/">Продукт <?= $number ?></a></li>
<?php endfor; ?>
</ul></nav>
<section id="description"><h2>Описание продукта</h2><p>Якорь для второго QR: <code>#description</code>. Текст появится после получения утверждённых материалов.</p></section>
</html>
