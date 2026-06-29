<?php

namespace App\Modules\DailyOperations\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DailyLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'project' => [
                'id' => $this->project_id,
                'name' => $this->project->name ?? null,
            ],
            'recorder' => [
                'id' => $this->recorder_id,
                'name' => $this->recorder->name ?? null,
            ],
            'date' => $this->date->format('Y-m-d'),
            'status' => $this->status,
            'general_notes' => $this->general_notes,
            'labor_count' => $this->laborAttendance->count(),
            'equipment_count' => $this->equipmentUsage->count(),
            'attendance' => $this->laborAttendance->map(function ($item) {
                return [
                    'employee_id' => $item->employee_id,
                    'name' => $item->employee->name ?? null,
                    'hours' => $item->hours,
                    'overtime' => $item->overtime,
                    'status' => $item->status,
                ];
            }),
            'equipment' => $this->equipmentUsage->map(function ($item) {
                return [
                    'equipment_id' => $item->equipment_id,
                    'name' => $item->equipment->name ?? null,
                    'work_hours' => $item->work_hours,
                    'status' => $item->status,
                ];
            }),
            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}
