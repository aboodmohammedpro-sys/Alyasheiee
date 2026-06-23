<?php

namespace App\Modules\ProjectManagement\Services;

use App\Modules\ProjectManagement\DTOs\ProjectDTO;
use App\Modules\ProjectManagement\Models\Project;
use App\Modules\ProjectManagement\Repositories\ProjectRepository;
use Illuminate\Support\Facades\DB;

class ProjectService
{
    public function __construct(
        protected ProjectRepository $repository
    ) {}

    public function createProject(ProjectDTO $dto): Project
    {
        return DB::transaction(function () use ($dto) {
            // إضافة أي منطق عمل إضافي هنا قبل الحفظ
            return $this->repository->create([
                'name' => $dto->name,
                'code' => $dto->code,
                'client_name' => $dto->client_name,
                'location' => $dto->location,
                'start_date' => $dto->start_date,
                'expected_end_date' => $dto->expected_end_date,
                'estimated_budget' => $dto->estimated_budget,
                'status' => $dto->status,
                'description' => $dto->description,
            ]);
        });
    }

    public function updateProjectProgress(string $uuid, int $percentage): bool
    {
        // قاعدة عمل: لا يمكن تجاوز 100%
        if ($percentage > 100) $percentage = 100;

        return $this->repository->update($uuid, [
            'progress_percentage' => $percentage
        ]);
    }
}
