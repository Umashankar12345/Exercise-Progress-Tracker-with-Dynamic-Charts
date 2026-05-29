<?php

namespace App\Services;

use App\Services\AI\GeminiService;
use Illuminate\Support\Facades\Log;

class AIFitnessService
{
    public function __construct(protected GeminiService $gemini) {}

    public function generateWorkoutPlan($user, $goals, $fitnessLevel)
    {
        $systemInstruction = "You are an elite AI fitness coach. Return ONLY valid JSON structured as requested.";
        $prompt = "Create a 3-day workout plan for a {$fitnessLevel} user whose goals are: {$goals}. Return ONLY valid JSON structured as: { \"days\": [ { \"day\": 1, \"title\": \"...\", \"exercises\": [ { \"name\": \"...\", \"sets\": 3, \"reps\": \"...\" } ] } ] }";
        
        try {
            $jsonResponse = $this->gemini->ask($systemInstruction, $prompt, null, [
                'responseMimeType' => 'application/json'
            ]);
            return json_decode(trim($jsonResponse), true);
        } catch (\Exception $e) {
            Log::error('AIFitnessService Workout Plan Generation Error: ' . $e->getMessage());
            return ["error" => "Failed to generate AI workout plan"];
        }
    }

    public function getChatbotResponse($user, $message, $context = [])
    {
        $systemInstruction = "You are FitTrack AI, an elite futuristic fitness assistant. Provide a highly motivational, concise response in under 50 words.";
        $prompt = "The user {$user->name} says: '{$message}'.";
        
        try {
            return $this->gemini->ask($systemInstruction, $prompt);
        } catch (\Exception $e) {
            Log::error('AIFitnessService Chatbot Response Error: ' . $e->getMessage());
            return "Failed to generate AI response";
        }
    }
    
    public function generateFitnessDNA($user)
    {
        $systemInstruction = "Based on standard fitness metrics, classify this user into one of these archetypes: Warrior, Beast Mode, Athlete, Balanced Human. Just return the archetype name.";
        $prompt = "Classify the user {$user->name}.";
        
        try {
            return $this->gemini->ask($systemInstruction, $prompt);
        } catch (\Exception $e) {
            Log::error('AIFitnessService Fitness DNA Generation Error: ' . $e->getMessage());
            return "Balanced Human";
        }
    }
}
