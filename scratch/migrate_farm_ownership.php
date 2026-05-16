<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;

$options = getopt('', ['from-email::', 'to-email::']);
$fromEmail = $options['from-email'] ?? 'demo_backup@gmail.com';
$toEmail = $options['to-email'] ?? 'demo@gmail.com';

$fromUser = User::where('email', $fromEmail)->first();
$toUser = User::where('email', $toEmail)->first();

if (! $fromUser || ! $toUser) {
    fwrite(STDERR, "Unable to resolve source or target user.\n");
    exit(1);
}

$fromId = (string) $fromUser->id;
$toId = (string) $toUser->id;

$collections = [
    'animals',
    'cattle',
    'sheep',
    'locations',
    'animal_attachments',
    'health_records',
    'breeding_records',
    'movement_records',
    'sales_records',
];

$db = app('db')->connection('mongodb')->getMongoDB();

echo "Migrating farm data from {$fromEmail} ({$fromId}) to {$toEmail} ({$toId})\n";

foreach ($collections as $collectionName) {
    $collection = $db->selectCollection($collectionName);

    $filter = ['user_id' => $fromId];
    $before = $collection->countDocuments($filter);

    if ($before === 0) {
        echo sprintf("- %s: no records\n", $collectionName);
        continue;
    }

    $result = $collection->updateMany(
        $filter,
        ['$set' => ['user_id' => $toId]]
    );

    echo sprintf("- %s: moved %d of %d records\n", $collectionName, $result->getModifiedCount(), $before);
}

echo "Done.\n";