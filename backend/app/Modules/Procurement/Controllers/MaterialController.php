<?php

namespace App\Modules\Procurement\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Procurement\Models\Material;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MaterialController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Material::all());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|unique:materials',
            'name' => 'required|string',
            'category' => 'required|string',
            'unit' => 'required|string',
        ]);

        $material = Material::create($validated);
        return response()->json($material, 201);
    }
}
