<?php

namespace App\Services\AI;

class AIOrchestratorService
{
    public function route(string $type)
    {
        return match ($type) {
            'jarvis' => app(JarvisService::class),
            'insights' => app(InsightsService::class),
            'vision' => app(VisionService::class),
            'recovery' => app(RecoveryService::class),
            default => throw new \Exception('Invalid AI type')
        };
    }
}
