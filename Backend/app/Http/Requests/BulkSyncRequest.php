<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BulkSyncRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'workouts' => 'required|array',
            'workouts.*.name' => 'required|string',
            'workouts.*.started_at' => 'required|date',
            'workouts.*.ended_at' => 'nullable|date',
            'workouts.*.notes' => 'nullable|string',
            'workouts.*.sets' => 'required|array|min:1',
            'workouts.*.sets.*.reps' => 'required|integer|min:0',
            'workouts.*.sets.*.weight' => 'required|numeric|min:0',
            'workouts.*.sets.*.distance' => 'nullable|numeric|min:0',
            'workouts.*.sets.*.duration_seconds' => 'nullable|integer|min:0',
            'workouts.*.sets.*.type' => 'nullable|string|in:strength,cardio',
        ];
    }
}
