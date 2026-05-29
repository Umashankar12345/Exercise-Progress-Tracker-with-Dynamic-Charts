<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->bootstrap();

use App\Services\AI\GeminiService;

try {
    $gemini = new GeminiService();
    echo "Querying Gemini Service...\n";
    $reply = $gemini->ask("You are a helpful coach.", "Hello! Can you hear me?");
    echo "Reply:\n" . $reply . "\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
