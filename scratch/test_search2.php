<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$req = \Illuminate\Http\Request::create('/api/farm/animals/search', 'GET', ['type' => 'male', 'species' => 'cow']);
$res = app(\App\Http\Controllers\AnimalController::class)->search($req);
echo $res->getContent();
