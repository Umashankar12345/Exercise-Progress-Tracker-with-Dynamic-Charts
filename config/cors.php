<?php

return [
    // Allow API routes
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    // Allow all HTTP methods
    'allowed_methods' => ['*'],
    // Restrict origins to local dev frontend
    'allowed_origins' => ['http://localhost:5173'],
    // No origin patterns needed
    'allowed_origins_patterns' => [],
    // Allow all headers
    'allowed_headers' => ['*'],
    // No extra exposed headers
    'exposed_headers' => [],
    // No caching of preflight
    'max_age' => 0,
    // Enable credentials (cookies, auth headers)
    'supports_credentials' => true,
];
