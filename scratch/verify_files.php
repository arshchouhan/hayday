<?php

use App\Models\AnimalAttachment;

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$attachments = AnimalAttachment::all();
foreach ($attachments as $a) {
    echo "ID: " . $a->id . "\n";
    echo " - File Name: " . $a->file_name . "\n";
    echo " - File Path: " . $a->file_path . "\n";
    echo " - File Exists: " . (file_exists(public_path(str_replace(config('app.url'), '', $a->file_path))) ? 'YES' : 'NO') . "\n";
}
