<?php

use App\Models\AnimalAttachment;

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$attachments = AnimalAttachment::all();
echo "Total attachments to check: " . count($attachments) . "\n";

$oldBase = 'http://localhost/storage';
$newBase = 'http://localhost:8000/storage';

foreach ($attachments as $a) {
    if (strpos($a->file_path, $oldBase) !== false && strpos($a->file_path, $newBase) === false) {
        echo "Updating attachment " . $a->id . " - fixing URL\n";
        $a->file_path = str_replace($oldBase, $newBase, $a->file_path);
        $a->save();
    } else {
        echo "Attachment " . $a->id . " already has correct URL or non-matching base: " . $a->file_path . "\n";
    }
}

echo "Done.\n";
