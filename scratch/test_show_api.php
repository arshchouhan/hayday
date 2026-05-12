<?php

use App\Http\Controllers\AnimalController;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Simulate a logged in user (demo)
$user = User::where('email', 'demo@gmail.com')->first();
Auth::login($user);

$id = '6a036736836ca970ad0307d6'; // The cattle ID from before
$controller = new AnimalController();
$response = $controller->show($id);

echo "Response Status: " . $response->getStatusCode() . "\n";
$data = json_decode($response->getContent(), true);

echo "Animal ID: " . ($data['id'] ?? 'N/A') . "\n";
echo "Attachments count in JSON: " . (isset($data['attachments']) ? count($data['attachments']) : 'NOT SET') . "\n";

if (isset($data['attachments'])) {
    foreach ($data['attachments'] as $a) {
        echo " - " . ($a['file_name'] ?? 'unnamed') . "\n";
    }
}
