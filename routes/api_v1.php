<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API V1 Routes - Architecture Standard
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // 1. Authentication (Shared)
    Route::prefix('auth')->group(function () {
        // Login, Logout, Profile
    });

    // 2. Projects (Web: Admin/Create, Mobile: View)
    Route::prefix('projects')->group(function () {
        Route::get('/', [\App\Modules\ProjectManagement\Controllers\ProjectController::class, 'index']); // Shared
        Route::post('/', [\App\Modules\ProjectManagement\Controllers\ProjectController::class, 'store']); // Web Only
        Route::get('/{project}', [\App\Modules\ProjectManagement\Controllers\ProjectController::class, 'show']); // Shared
    });

    // 3. Resources (Shared/Web)
    Route::get('employees', [\App\Modules\ResourceAllocation\Controllers\ResourceController::class, 'getEmployees']);
    Route::get('equipment', [\App\Modules\ResourceAllocation\Controllers\ResourceController::class, 'getEquipment']);

    // 4. Daily Operations (Mobile: Execution, Web: Review)
    Route::prefix('daily-operations')->group(function () {
        Route::post('logs', [\App\Modules\DailyOperations\Controllers\DailyLogController::class, 'store']); // Mobile (Recorder)
        Route::post('logs/{log}/approve', [\App\Modules\DailyOperations\Controllers\DailyLogController::class, 'approve']); // Mobile (Senior) / Web
        Route::get('logs', [\App\Modules\DailyOperations\Controllers\DailyLogController::class, 'index']); // Shared/Web
    });

    // 5. Procurement & Warehouse (Web: Mgmt, Mobile: Disbursement)
    Route::prefix('warehouse')->group(function () {
        Route::get('tanks', [\App\Modules\FuelManagement\Controllers\FuelController::class, 'getTanks']);
        Route::post('dispense', [\App\Modules\FuelManagement\Controllers\FuelController::class, 'dispense']); // Mobile (Fuel Dept)
        
        // Disbursement Flow
        Route::post('disbursement', [\App\Modules\Warehouse\Controllers\DisbursementController::class, 'store']); // Mobile/Web
        Route::post('disbursement/{disbursementRequest}/confirm', [\App\Modules\Warehouse\Controllers\DisbursementController::class, 'confirm']);
        Route::post('disbursement/{disbursementRequest}/approve', [\App\Modules\Warehouse\Controllers\DisbursementController::class, 'approve']); // Web Only
        Route::post('disbursement/{disbursementRequest}/issue', [\App\Modules\Warehouse\Controllers\DisbursementController::class, 'issue']); // Web/Mobile (Store Keeper)
    });

    // 6. Reports & Financials (Web Only)
    Route::prefix('reports')->group(function () {
        // Cost reports, budget vs actual
    });

});
