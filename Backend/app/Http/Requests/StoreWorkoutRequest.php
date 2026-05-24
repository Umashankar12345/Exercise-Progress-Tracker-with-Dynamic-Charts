<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreWorkoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'logged_at' => 'nullable|date',
            'started_at' => 'required|date',
            'ended_at' => 'nullable|date|after_or_equal:started_at',
            'notes' => 'nullable|string|max:1000',
            'sets' => 'required|array|min:1',
            'sets.*.exercise_id' => 'required|exists:exercises,id',
            'sets.*.set_number' => 'required|integer|min:1',
            'sets.*.type' => 'required|string|in:strength,cardio',

            // Core data boundaries preventing chart breaking metrics
            'sets.*.weight' => 'required_if:sets.*.type,strength|nullable|numeric|between:0,1000',
            'sets.*.reps' => 'required_if:sets.*.type,strength|nullable|integer|between:1,100',
            'sets.*.distance' => 'required_if:sets.*.type,cardio|nullable|numeric|between:0,500',
            'sets.*.duration_seconds' => 'required_if:sets.*.type,cardio|nullable|integer|between:0,86400',
        ];
    }
}
