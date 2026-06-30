<?php
$files = glob('d:/Alyasheiee/backend/database/migrations/*.php');
foreach ($files as $f) {
    if (!is_file($f))
        continue;
    $c = file_get_contents($f);
    $original = $c;
    $c = preg_replace("/foreignUuid\('([^']+)'\)->constrained\('users'\)/", "foreignId('$1')->constrained('users')", $c);
    $c = preg_replace("/foreignUuid\('([^']+)'\)->nullable\(\)->constrained\('users'\)/", "foreignId('$1')->nullable()->constrained('users')", $c);
    if ($c !== $original) {
        file_put_contents($f, $c);
        echo "Updated: " . basename($f) . PHP_EOL;
    }
}
