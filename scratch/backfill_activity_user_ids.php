<?php
/**
 * scratch/backfill_activity_user_ids.php
 *
 * Backfills user_id = demo@gmail.com's _id onto all existing records
 * in health_records, breeding_records, movement_records, sales_records
 * that currently have no user_id (or an empty one).
 *
 * Run from the project root:
 *   php scratch/backfill_activity_user_ids.php
 */

require __DIR__ . '/../vendor/autoload.php';
$app    = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use MongoDB\BSON\ObjectId;

// ── 1. Resolve demo user ─────────────────────────────────────────────────────
$demoUser = User::where('email', 'demo@gmail.com')->first();

if (!$demoUser) {
    echo "ERROR: No user with email demo@gmail.com found in the database.\n";
    echo "Please create or seed that user first.\n";
    exit(1);
}

$demoId = (string) $demoUser->id;
echo "Demo user found → ID: {$demoId}\n\n";

// ── 2. Collections to patch ──────────────────────────────────────────────────
// We use the raw MongoDB collection so we are not blocked by any future
// global scope, and because these models don't have user_id in $fillable yet.
$db = app('db')->connection('mongodb')->getMongoDB();

$collections = [
    'health_records',
    'breeding_records',
    'movement_records',
    'sales_records',
    'animal_attachments',
];

// ── 3. Patch each collection ─────────────────────────────────────────────────
foreach ($collections as $collectionName) {
    $collection = $db->selectCollection($collectionName);

    // Count documents that are missing user_id or have it empty/null
    $missing = $collection->countDocuments([
        '$or' => [
            ['user_id' => ['$exists' => false]],
            ['user_id' => null],
            ['user_id' => ''],
        ],
    ]);

    echo "Collection [{$collectionName}]: {$missing} records without user_id.";

    if ($missing === 0) {
        echo " → Nothing to do.\n";
        continue;
    }

    $result = $collection->updateMany(
        [
            '$or' => [
                ['user_id' => ['$exists' => false]],
                ['user_id' => null],
                ['user_id' => ''],
            ],
        ],
        [
            '$set' => ['user_id' => $demoId],
        ]
    );

    $updated = $result->getModifiedCount();
    echo " → Updated {$updated} records.\n";
}

echo "\nDone. All activity records now have the demo user's ID attached.\n";
