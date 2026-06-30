<?php

namespace App\Modules\Procurement\Controllers;

use App\Http\Controllers\BaseController;
use App\Modules\Procurement\Models\Material;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MaterialController extends BaseController
{
    /**
     * قائمة المواد
     */
    public function index(Request $request): JsonResponse
    {
        $query = Material::query();

        if ($request->has('category')) {
            $query->where('category', $request->query('category'));
        }

        if ($request->has('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('code', 'ilike', "%{$search}%");
            });
        }

        return $this->successResponse($query->get());
    }

    /**
     * عرض تفاصيل مادة
     */
    public function show(Material $material): JsonResponse
    {
        return $this->successResponse($material);
    }

    /**
     * إنشاء مادة جديدة
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code'        => 'required|unique:materials',
            'name'        => 'required|string',
            'category'    => 'required|string',
            'unit'        => 'required|string',
            'description' => 'nullable|string',
        ]);

        $material = Material::create($validated);
        return $this->successResponse($material, 'تم إنشاء المادة بنجاح.', 201);
    }
}
