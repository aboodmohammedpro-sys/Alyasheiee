<?php

namespace App\Modules\ProjectManagement\Repositories;

use App\Modules\ProjectManagement\Models\Project;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ProjectRepository
{
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Project::latest()->paginate($perPage);
    }

    public function findById(string $uuid): ?Project
    {
        return Project::findOrFail($uuid);
    }

    public function create(array $data): Project
    {
        return Project::create($data);
    }

    public function update(string $uuid, array $data): bool
    {
        $project = $this->findById($uuid);
        return $project->update($data);
    }

    public function delete(string $uuid): bool
    {
        $project = $this->findById($uuid);
        return $project->delete();
    }
}
