<?php

namespace App\Http\Controllers\Api\AI;

use App\Http\Controllers\Controller;
use App\Services\AI\GeminiService;
use App\Services\AI\MemoryService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ChatController extends Controller
{
    protected GeminiService $gemini;
    protected MemoryService $memory;

    public function __construct(GeminiService $gemini, MemoryService $memory)
    {
        $this->gemini = $gemini;
        $this->memory = $memory;
    }

    /**
     * Stream chat with Jarvis using Gemini.
     * Expects JSON: { message: string, stream: true }
     */
    public function streamChat(Request $request): StreamedResponse
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $user = $request->user();
        $prompt = $request->input('message');
        // Retrieve user memory for context
        $memory = $this->memory->getMemory($user->id);
        $systemInstruction = "You are Jarvis, a premium AI Athletics Coach. Use the provided user memory to personalize responses.\n" . json_encode($memory);

        // Use GeminiService streamChat which returns a streamed Response
        return $this->gemini->streamChat(
            $systemInstruction,
            $prompt,
            null, // optional AiSession handling can be added later
            $memory
        );
    }
}
?>
