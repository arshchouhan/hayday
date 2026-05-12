<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Storage;

echo "Public Disk URL for 'test.png': " . Storage::disk('public')->url('test.png') . "\n";
echo "APP_URL: " . config('app.url') . "\n";
