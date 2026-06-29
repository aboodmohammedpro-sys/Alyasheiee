<?php

namespace App\Modules\Procurement\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Procurement\Models\PurchaseRequest;
use App\Modules\Procurement\Services\PurchaseRequestService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PurchaseRequestController extends Controller
{
    protected $service;

    public function __construct(PurchaseRequestService $service)
    {
        $this->service = $service;
    }

    public function index(): JsonResponse
    {
        $requests = PurchaseRequest::with(['project', 'requester', 'items.material'])->get();
        return response()->json($requests);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'project_id' => 'required|uuid|exists:projects,id',
            'required_date' => 'nullable|date',
            'items' => 'required|array|min:1',
            'items.*.material_id' => 'required|uuid|exists:materials,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.estimated_unit_price' => 'nullable|numeric',
        ]);

        $purchaseRequest = $this->service->createRequest($validated);
        
        return response()->json([
            'message' => 'Purchase Request created successfully.',
            'data' => $purchaseRequest
        ], 201);
    }

    public function show(PurchaseRequest $request): JsonResponse
    {
        return response()->json($request->load(['project', 'requester', 'items.material']));
    }
}
