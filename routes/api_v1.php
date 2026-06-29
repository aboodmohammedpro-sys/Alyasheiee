<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API V1 Routes - Architecture Standard (Modular Monolith)
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // 1. Authentication (Public)
    Route::post('auth/login', [\App\Modules\Auth\Controllers\AuthController::class, 'login']);

    // --- PROTECTED ROUTES ---
    Route::middleware('auth:sanctum')->group(function () {
        
        Route::post('auth/logout', [\App\Modules\Auth\Controllers\AuthController::class, 'logout']);

        // 2. Projects (Web: Admin/Create, Mobile: View)
        Route::get('projects', [\App\Modules\ProjectManagement\Controllers\ProjectController::class, 'index']); 
        Route::post('projects', [\App\Modules\ProjectManagement\Controllers\ProjectController::class, 'store']); 
        Route::get('projects/{project}', [\App\Modules\ProjectManagement\Controllers\ProjectController::class, 'show']); 

        // 3. Resources (Shared Resources)
        Route::get('resources/employees', [\App\Modules\ResourceAllocation\Controllers\ResourceController::class, 'getEmployees']);
        Route::get('resources/equipment', [\App\Modules\ResourceAllocation\Controllers\ResourceController::class, 'getEquipment']);

        // 4. Daily Operations (Mobile: Execution, Web: Review)
        Route::prefix('daily-operations')->group(function () {
            Route::post('logs', [\App\Modules\DailyOperations\Controllers\DailyLogController::class, 'store']); 
            Route::post('logs/{log}/approve', [\App\Modules\DailyOperations\Controllers\DailyLogController::class, 'approve']); 
            Route::get('logs', [\App\Modules\DailyOperations\Controllers\DailyLogController::class, 'index']); 
        });

        // 5. Warehouse & Fuel Management
        Route::prefix('warehouse')->group(function () {
            Route::get('tanks', [\App\Modules\FuelManagement\Controllers\FuelController::class, 'getTanks']);
            Route::post('dispense', [\App\Modules\FuelManagement\Controllers\FuelController::class, 'dispense']); // Fuel Dispatcher
            
            // Disbursement Flow
            Route::post('disbursement', [\App\Modules\Warehouse\Controllers\DisbursementController::class, 'store']); // Recorder/Storekeeper
            Route::post('disbursement/{disbursementRequest}/confirm', [\App\Modules\Warehouse\Controllers\DisbursementController::class, 'confirm']);
            Route::post('disbursement/{disbursementRequest}/approve', [\App\Modules\Warehouse\Controllers\DisbursementController::class, 'approve']); // PM Only
            Route::post('disbursement/{disbursementRequest}/issue', [\App\Modules\Warehouse\Controllers\DisbursementController::class, 'issue']); // Store Keeper

            // GRN (Goods Received Note)
            Route::post('grn', [\App\Modules\Warehouse\Controllers\GrnController::class, 'store']); // Store Keeper
        });

        // 6. Procurement (Web Management)
        Route::prefix('procurement')->group(function () {
            Route::get('purchase-orders', [\App\Modules\Procurement\Controllers\PurchaseOrderController::class, 'index']);
            Route::post('purchase-orders/convert', [\App\Modules\Procurement\Controllers\PurchaseOrderController::class, 'convert']);
            Route::get('purchase-orders/{purchaseOrder}', [\App\Modules\Procurement\Controllers\PurchaseOrderController::class, 'show']);
        });

        // 7. Reports & Financial Dashboard (Web Only)
        Route::get('reports/project-dashboard/{project}', [\App\Modules\CostControl\Controllers\ReportController::class, 'projectDashboard']);
    });
});
