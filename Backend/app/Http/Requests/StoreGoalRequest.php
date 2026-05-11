<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGoalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // ownership enforced at model level
    }

    public function rules(): array
    {
        return [
            'exercise_id'  => ['required', 'integer', 'exists:exercises,id'],
            'target_kg'    => ['required', 'numeric', 'min:1', 'max:1000'],
            'target_date'  => ['required', 'date', 'after:today'],
        ];
    }

    public function messages(): array
    {
        return [
            'exercise_id.exists' => 'Please choose a valid exercise.',
            'target_date.after'  => 'Target date must be in the future.',
            'target_kg.min'      => 'Target weight must be at least 1 kg.',
        ];
    }
}
