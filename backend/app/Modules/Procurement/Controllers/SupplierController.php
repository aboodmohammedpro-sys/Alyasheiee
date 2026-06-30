<?php

namespace App\Modules\Procurement\Controllers;

use App\Http\Controllers\BaseController;
use App\Modules\Procurement\Models\Supplier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupplierController extends BaseController
{
    /**
     * قائمة الموردين
     */
    public function index(): JsonResponse
    {
        $suppliers = Supplier::whereNull('deleted_at')->get();
        return $this->successResponse($suppliers);
    }

    /**
     * عرض تفاصيل مورد
     */
    public function show(Supplier $supplier): JsonResponse
    {
        return $this->successResponse($supplier);
    }

    /**
     * إنشاء مورد جديد
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'phone'          => 'nullable|string|max:50',
            'email'          => 'nullable|email|max:255',
            'address'        => 'nullable|string',
        ]);

        $supplier = Supplier::create($validated);
        return $this->successResponse($supplier, 'تم إنشاء المورد بنجاح.', 201);
    }
}
