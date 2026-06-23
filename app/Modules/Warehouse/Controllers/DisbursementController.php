<?php

namespace App\Modules\Warehouse\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Warehouse\Models\DisbursementRequest;
use App\Modules\Warehouse\Services\DisbursementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DisbursementController extends Controller
{
    protected $disbursementService;

    public function __construct(DisbursementService $disbursementService)
    {
        $this->disbursementService = $disbursementService;
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'project_id' => 'required|uuid|exists:projects,id',
            'type' => 'required|in:material,spare_part,fuel,oil',
            'items' => 'required|array|min:1',
            'items.*.item_name' => 'required|string',
            'items.*.quantity' => 'required|numeric|min:0',
            'items.*.unit' => 'nullable|string',
        ]);

        $disbursementRequest = $this->disbursementService->createRequest($validated);
        return response()->json($disbursementRequest->load('items'), 201);
    }

    public function confirm(DisbursementRequest $disbursementRequest): JsonResponse
    {
        // التحقق من الصلاحيات (كبير مراقبين) يتم هنا أو عبر Middleware
        $updated = $this->disbursementService->confirmRequest($disbursementRequest);
        return response()->json($updated);
    }

    public function approve(Request $request, DisbursementRequest $disbursementRequest): JsonResponse
    {
        $validated = $request->validate([
            'warehouse_id' => 'required|uuid' // سيتم الربط بجدول المخازن لاحقاً
        ]);

        $updated = $this->disbursementService->approveRequest($disbursementRequest, $validated['warehouse_id']);
        return response()->json($updated);
    }
}
