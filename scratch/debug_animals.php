<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Animal;
use App\Models\Cattle;
use App\Models\Sheep;
use Illuminate\Http\Request;

$request = new Request([
    'page' => 1,
    'limit' => 12,
    'search' => null,
    'location_id' => null,
    'group_id' => null
]);

$controller = new \App\Http\Controllers\AnimalController();
$response = $controller->index($request);

echo $response->getContent();
