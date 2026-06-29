<?php

namespace App\Modules\ProjectManagement\Controllers;

use App\Http\Controllers\BaseController;
use App\Modules\ProjectManagement\DTOs\ProjectDTO;
use App\Modules\ProjectManagement\Requests\StoreProjectRequest;
use App\Modules\ProjectManagement\Resources\ProjectResource;
use App\Modules\ProjectManagement\Services\ProjectService;
use App\Modules\ProjectManagement\Repositories\ProjectRepository;
use Illuminate\Http\JsonResponse;

class ProjectController extends BaseController
{
    public function __construct(
        protected ProjectService $service,
        protected ProjectRepository $repository
    ) {}

    /**
     * Shared: قائمة المشاريع (تستخدم في الويب والموبايل)
     */
    public function index(): JsonResponse
    {
        $projects = $this->repository->paginate();
        return $this->paginatedResponse($projects);
    }

    /**
     * Web Only: إنشاء مشروع جديد
     */
    public function store(StoreProjectRequest $request): JsonResponse
    {
        $project = $this->service->createProject(
            ProjectDTO::fromRequest($request->validated())
        );

        return $this->successResponse(
            new ProjectResource($project),
            'Project created successfully.',
            201
        );
    }

    /**
     * Shared: تفاصيل المشروع
     */
    public function show(string $id): JsonResponse
    {
        $project = $this->repository->findById($id);
        return $this->successResponse(new ProjectResource($project));
    }
}
