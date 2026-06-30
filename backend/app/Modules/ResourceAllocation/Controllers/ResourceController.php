<?php

namespace App\Modules\ResourceAllocation\Controllers;

use App\Http\Controllers\BaseController;
use App\Modules\ResourceAllocation\Models\Employee;
use App\Modules\ResourceAllocation\Models\Equipment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ResourceController extends BaseController
{
    /**
     * قائمة جميع العمال (أو المصفاة حسب المشروع)
     */
    public function getEmployees(Request $request): JsonResponse
    {
        $query = Employee::query();

        // تصفية حسب المشروع إذا تم توفيره
        if ($request->has('project_id')) {
            $projectId = $request->query('project_id');
            $query->whereHas('assignments', function ($q) use ($projectId) {
                $q->where('project_id', $projectId)
                  ->where('status', 'active');
            });
        }

        // تصفية حسب الحالة (افتراضياً نشط فقط)
        $status = $request->query('status', 'active');
        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $employees = $query->get();
        return $this->successResponse($employees, 'Employees retrieved successfully.');
    }

    /**
     * قائمة جميع المعدات (أو المصفاة حسب المشروع)
     */
    public function getEquipment(Request $request): JsonResponse
    {
        $query = Equipment::query();

        // تصفية حسب المشروع إذا تم توفيره
        if ($request->has('project_id')) {
            $projectId = $request->query('project_id');
            $query->whereHas('assignments', function ($q) use ($projectId) {
                $q->where('project_id', $projectId)
                  ->where('status', 'active');
            });
        }

        // تصفية حسب الحالة (افتراضياً نشط فقط)
        $status = $request->query('status', 'active');
        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $equipment = $query->get();
        return $this->successResponse($equipment, 'Equipment retrieved successfully.');
    }
}
