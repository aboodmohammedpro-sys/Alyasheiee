<?php

namespace App\Modules\DailyOperations\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class StoreDailyLogRequest extends FormRequest
{
    public function authorize(): bool
    {
        // التحقق من أن المستخدم معين لهذا المشروع كـ Recorder أو PM
        $projectId = $this->input('project_id');
        
        return DB::table('project_assignments')
            ->where('project_id', $projectId)
            ->where('assignable_id', Auth::id())
            ->where('status', 'active')
            ->exists() || Auth::user()->hasRole('admin');
    }

    public function rules(): array
    {
        return [
            'project_id' => ['required', 'uuid', 'exists:projects,id'],
            'date' => ['required', 'date', 'before_or_equal:today'],
            'general_notes' => ['nullable', 'string'],
            
            // التحقق من مصفوفة الحضور
            'labor_attendance' => ['required', 'array', 'min:1'],
            'labor_attendance.*.employee_id' => ['required', 'uuid', 'exists:employees,id'],
            'labor_attendance.*.hours' => ['required', 'numeric', 'min:0', 'max:24'],
            'labor_attendance.*.overtime' => ['nullable', 'numeric', 'min:0', 'max:24'],
            'labor_attendance.*.status' => ['required', 'string', 'in:present,absent,leave'],
            
            // التحقق من مصفوفة المعدات
            'equipment_usage' => ['nullable', 'array'],
            'equipment_usage.*.equipment_id' => ['required', 'uuid', 'exists:equipment,id'],
            'equipment_usage.*.start_meter' => ['nullable', 'numeric'],
            'equipment_usage.*.end_meter' => ['nullable', 'numeric'],
            'equipment_usage.*.work_hours' => ['nullable', 'numeric', 'min:0', 'max:24'],
            'equipment_usage.*.status' => ['required', 'string', 'in:working,standby,breakdown'],
        ];
    }
}
