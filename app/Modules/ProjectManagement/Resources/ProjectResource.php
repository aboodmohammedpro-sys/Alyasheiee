<?php

namespace App\Modules\ProjectManagement\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'client_name' => $this->client_name,
            'location' => $this->location,
            'start_date' => $this->start_date?->format('Y-m-d'),
            'expected_end_date' => $this->expected_end_date?->format('Y-m-d'),
            'estimated_budget' => (float) $this->estimated_budget,
            'progress' => $this->progress_percentage,
            'status' => $this->status,
            'status_label' => $this->status?->label(),
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}
