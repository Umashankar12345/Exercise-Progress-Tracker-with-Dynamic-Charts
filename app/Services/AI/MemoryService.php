<?php

namespace App\Services\AI;

use App\Models\AiMemory;
use Illuminate\Support\Facades\Log;

class MemoryService
{
    /**
     * Retrieve memory for a user as associative array.
     */
    public function getMemory(int $userId): array
    {
        $records = AiMemory::where('user_id', $userId)->get();
        $memory = [];
        foreach ($records as $rec) {
            $memory[$rec->memory_type] = json_decode($rec->content, true);
        }
        return $memory;
    }

    /**
     * Save or update memory for a user.
     */
    public function saveMemory(int $userId, string $type, array $data, int $importance = 1): void
    {
        $content = json_encode($data, JSON_UNESCAPED_UNICODE);
        AiMemory::updateOrCreate(
            ['user_id' => $userId, 'memory_type' => $type],
            ['content' => $content, 'importance' => $importance]
        );
    }

    /**
     * Append data to existing memory type (merge arrays).
     */
    public function appendMemory(int $userId, string $type, array $newData, int $importance = 1): void
    {
        $existing = AiMemory::where('user_id', $userId)->where('memory_type', $type)->first();
        if ($existing) {
            $current = json_decode($existing->content, true) ?? [];
            $merged = array_merge($current, $newData);
            $existing->content = json_encode($merged, JSON_UNESCAPED_UNICODE);
            $existing->importance = $importance;
            $existing->save();
        } else {
            $this->saveMemory($userId, $type, $newData, $importance);
        }
    }
}
?>
