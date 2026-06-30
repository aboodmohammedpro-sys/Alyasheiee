<?php

namespace App\Modules\ProjectManagement\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'              => 'required|string|max:255',
            'code'              => 'required|string|max:50|unique:projects,code',
            'client_name'       => 'nullable|string|max:255',
            'location'          => 'nullable|string|max:255',
            'start_date'        => 'nullable|date',
            'expected_end_date' => 'nullable|date|after_or_equal:start_date',
            'estimated_budget'  => 'nullable|numeric|min:0',
            'status'            => 'nullable|in:planning,active,on_hold,completed,cancelled',
            'description'       => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'                    => 'اسم المشروع مطلوب.',
            'code.required'                    => 'رمز المشروع مطلوب.',
            'code.unique'                      => 'رمز المشروع مستخدم مسبقاً، يرجى اختيار رمز آخر.',
            'expected_end_date.after_or_equal' => 'تاريخ الانتهاء يجب أن يكون بعد أو يساوي تاريخ البدء.',
            'estimated_budget.numeric'         => 'الميزانية التقديرية يجب أن تكون رقماً.',
            'estimated_budget.min'             => 'الميزانية التقديرية يجب أن تكون أكبر من أو تساوي صفر.',
            'status.in'                        => 'حالة المشروع غير صالحة.',
        ];
    }
}
