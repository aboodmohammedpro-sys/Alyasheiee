<?php

namespace App\Modules\ProjectManagement\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\ProjectManagement\DTOs\ProjectDTO;
use App\Modules\ProjectManagement\Requests\StoreProjectRequest;
use App\Modules\ProjectManagement\Resources\ProjectResource;
use App\Modules\ProjectManagement\Services\ProjectService;
use App\Modules\ProjectManagement\Repositories\ProjectRepository;
use Illuminate\Http\JsonResponse;

class ProjectController extends Controller
{
    public function __construct(
        protected ProjectService $service,
        protected ProjectRepository $repository
    ) {}

    public function index(): JsonResponse
    {
        $projects = $this->repository->paginate();
        return response()->json([
            'success' => true,
            'data' => ProjectResource::collection($projects),
            'meta' => [
                'total' => $projects->total()
            ]
        ]);
    }

    public function store(StoreProjectRequest $request): JsonResponse
    {
        $project = $this->service->createProject(
            ProjectDTO::fromRequest($request->validated())
        );

        return response()->json([
            'success' => true,
            'message' => 'تم إنشاء المشروع بنجاح',
            'data' => new ProjectResource($project)
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $project = $this->repository->findById($id);
        return response()->json([
            'success' => true,
            'data' => new ProjectResource($project)
        ]);
    }
}
