<?php

namespace App\Modules\ProjectManagement\Requests;

use App\Modules\ProjectManagement\Enums\ProjectStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // سيتم ربطها بـ Spatie Permission لاحقاً
    }

    public function rules(): void
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'unique:projects,code'],
            'client_name' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'start_date' => ['nullable', 'date'],
            'expected_end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'estimated_budget' => ['nullable', 'numeric', 'min:0'],
            'status' => ['nullable', Rule::enum(ProjectStatus::class)],
            'description' => ['nullable', 'string'],
        ];
    }
}
