<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGoalRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'exercise_id'  => ['required', 'exists:exercises,id'],
            'target_kg'    => ['required', 'numeric', 'min:1', 'max:1000'],
            'target_date'  => ['required', 'date', 'after:today'],
        ];
    }

    public function messages(): array
    {
        return [
            'target_date.after' => 'Target date must be in the future.',
            'target_kg.min'     => 'Target weight must be at least 1 kg.',
        ];
    }
}
