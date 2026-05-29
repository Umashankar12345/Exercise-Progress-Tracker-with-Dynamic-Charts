<?php

namespace App\Services\AI;

use App\Models\User;
use App\Models\AiSession;
use App\Models\NutritionPlan;
use App\Models\Workout;
use Illuminate\Support\Facades\Log;

class JarvisService
{
    public function __construct(protected GeminiService $gemini) {}

    /**
     * Generate custom workout split.
     */
    public function generateWorkoutPlan(User $user, array $preferences): array
    {
        $pastWorkouts = Workout::where('user_id', $user->id)
            ->with('sets')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $systemInstruction = "You are Jarvis, a elite strength and conditioning coach. Return ONLY valid JSON representing an adaptive workout split.";
        
        $prompt = "Generate a personalized training cycle for an athlete with the following details:\n";
        $prompt .= "Goals: " . json_encode($preferences['goals'] ?? 'Muscle Hypertrophy') . "\n";
        $prompt .= "Experience level: " . ($preferences['experience'] ?? 'Intermediate') . "\n";
        $prompt .= "Weekly frequency: " . ($preferences['frequency'] ?? '4 days/week') . "\n";
        $prompt .= "Past workout logs (for adaptation): " . json_encode($pastWorkouts) . "\n\n";
        $prompt .= "Output format MUST match this JSON structure exactly:\n";
        $prompt .= "{\n";
        $prompt .= "  \"split_name\": \"Hypertrophy Push/Pull/Legs\",\n";
        $prompt .= "  \"days\": [\n";
        $prompt .= "    {\n";
        $prompt .= "      \"day_number\": 1,\n";
        $prompt .= "      \"focus\": \"Push\",\n";
        $prompt .= "      \"exercises\": [\n";
        $prompt .= "        { \"name\": \"Bench Press\", \"sets\": 4, \"reps\": \"8-10\", \"tempo\": \"3110\", \"rest_seconds\": 90 }\n";
        $prompt .= "      ]\n";
        $prompt .= "    }\n";
        $prompt .= "  ],\n";
        $prompt .= "  \"coach_notes\": \"Ensure proper scapular retraction on pressing variations.\"\n";
        $prompt .= "}";

        try {
            $jsonResponse = $this->gemini->ask($systemInstruction, $prompt, null, [
                'responseMimeType' => 'application/json'
            ]);

            return json_decode(trim($jsonResponse), true) ?? $this->fallbackWorkoutPlan();
        } catch (\Exception $e) {
            Log::error('[JarvisService] Workout generation error: ' . $e->getMessage());
            return $this->fallbackWorkoutPlan();
        }
    }

    /**
     * Generate target nutrition and macros split.
     */
    public function generateMealPlan(User $user, array $metrics): array
    {
        $weightKg = $metrics['weight_kg'] ?? 80;
        $heightCm = $metrics['height_cm'] ?? 180;
        $age = $metrics['age'] ?? 25;
        $goal = $metrics['goal'] ?? 'bulking'; // cutting, bulking, recomp, maintenance
        $activityLevel = $metrics['activity_level'] ?? 'moderately_active';

        $systemInstruction = "You are Jarvis, a custom clinical nutritionist. Return ONLY valid JSON representing macro plans.";

        $prompt = "Create a customized macro and meal structure split for:\n";
        $prompt .= "- Weight: {$weightKg}kg, Height: {$heightCm}cm, Age: {$age}\n";
        $prompt .= "- Goal: {$goal}\n";
        $prompt .= "- Activity index: {$activityLevel}\n\n";
        $prompt .= "Format output exactly in this structure:\n";
        $prompt .= "{\n";
        $prompt .= "  \"daily_calories\": 2850,\n";
        $prompt .= "  \"protein_g\": 165,\n";
        $prompt .= "  \"carbs_g\": 320,\n";
        $prompt .= "  \"fats_g\": 85,\n";
        $prompt .= "  \"meal_structure\": [\n";
        $prompt .= "    { \"meal_name\": \"Breakfast\", \"target_macros\": \"50g C / 35g P / 15g F\", \"description\": \"Oatmeal with whey protein and berries\" }\n";
        $prompt .= "  ]\n";
        $prompt .= "}";

        try {
            $jsonResponse = $this->gemini->ask($systemInstruction, $prompt, null, [
                'responseMimeType' => 'application/json'
            ]);

            $result = json_decode(trim($jsonResponse), true);
            if ($result) {
                // Persist the nutrition plan
                NutritionPlan::create([
                    'user_id' => $user->id,
                    'daily_calories' => $result['daily_calories'],
                    'protein_g' => $result['protein_g'],
                    'carbs_g' => $result['carbs_g'],
                    'fats_g' => $result['fats_g'],
                    'goal_type' => $goal,
                    'meal_structure' => $result['meal_structure'],
                ]);

                return $result;
            }
            return $this->fallbackMealPlan();
        } catch (\Exception $e) {
            Log::error('[JarvisService] Meal planning error: ' . $e->getMessage());
            return $this->fallbackMealPlan();
        }
    }

    /**
     * Chat coaching inquiry with Jarvis.
     */
    public function askCoach(User $user, string $message, ?int $sessionId = null): string
    {
        $session = null;
        if ($sessionId) {
            $session = AiSession::where('user_id', $user->id)
                ->where('type', 'jarvis')
                ->find($sessionId);
        }

        if (!$session) {
            $session = AiSession::create([
                'user_id' => $user->id,
                'type' => 'jarvis',
                'status' => 'active',
            ]);
        }

        $systemInstruction = "You are Jarvis, an elite, direct bodybuilding and fitness coach. Answer questions with scientific precision but high-intensity motivational tones. Keep replies under 4 sentences.";

        try {
            return $this->gemini->ask($systemInstruction, $message, $session);
        } catch (\Exception $e) {
            Log::error('[JarvisService] Coach reply error: ' . $e->getMessage());
            return "I am experiencing server lag. Keep training hard while I calibrate my connection!";
        }
    }

    private function fallbackWorkoutPlan(): array
    {
        return [
            'split_name' => 'Adaptive Full Body Cycle',
            'days' => [
                [
                    'day_number' => 1,
                    'focus' => 'Full Body A',
                    'exercises' => [
                        ['name' => 'Barbell Squat', 'sets' => 3, 'reps' => '6-8', 'tempo' => '2010', 'rest_seconds' => 120],
                        ['name' => 'Incline DB Press', 'sets' => 3, 'reps' => '8-10', 'tempo' => '3110', 'rest_seconds' => 90],
                        ['name' => 'Lat Pulldowns', 'sets' => 3, 'reps' => '10-12', 'tempo' => '2012', 'rest_seconds' => 90],
                    ]
                ]
            ],
            'coach_notes' => 'Using standard safety protocols. Maintain consistent tension.'
        ];
    }

    private function fallbackMealPlan(): array
    {
        return [
            'daily_calories' => 2500,
            'protein_g' => 160,
            'carbs_g' => 280,
            'fats_g' => 80,
            'meal_structure' => [
                ['meal_name' => 'Meal 1', 'target_macros' => '40g C / 30g P / 12g F', 'description' => 'Scrambled eggs, whole wheat toast, spinach'],
                ['meal_name' => 'Meal 2', 'target_macros' => '80g C / 45g P / 20g F', 'description' => 'Grilled chicken breast with rice and steamed broccoli'],
            ]
        ];
    }
}
