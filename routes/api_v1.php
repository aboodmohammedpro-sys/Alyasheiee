<?php

use Illuminate\Support\Facades\Route;
use App\Modules\ProjectManagement\Controllers\ProjectController;
use App\Modules\DailyOperations\Controllers\DailyLogController;

Route::prefix('v1')->group(function () {
    
    // مشاريع المقاولات
    Route::apiResource('projects', ProjectController::class);

    // العمليات اليومية
    Route::post('daily-logs/{dailyLog}/submit', [\App\Modules\DailyOperations\Controllers\DailyLogController::class, 'submit']);
    Route::apiResource('daily-logs', \App\Modules\DailyOperations\Controllers\DailyLogController::class);

    // المشتريات والمواد
    Route::apiResource('materials', \App\Modules\Procurement\Controllers\MaterialController::class);
    Route::prefix('procurement')->group(function () {
        Route::apiResource('requests', \App\Modules\Procurement\Controllers\PurchaseRequestController::class);
    });

    // إدارة الوقود والمستودع
    Route::prefix('warehouse')->group(function () {
        Route::get('tanks', [\App\Modules\FuelManagement\Controllers\FuelController::class, 'getTanks']);
        Route::post('tanks', [\App\Modules\FuelManagement\Controllers\FuelController::class, 'storeTank']);
        Route::post('dispense', [\App\Modules\FuelManagement\Controllers\FuelController::class, 'dispense']);
        
        // طلبات الصرف
        Route::post('disbursement', [\App\Modules\Warehouse\Controllers\DisbursementController::class, 'store']);
        Route::post('disbursement/{disbursementRequest}/confirm', [\App\Modules\Warehouse\Controllers\DisbursementController::class, 'confirm']);
        Route::post('disbursement/{disbursementRequest}/approve', [\App\Modules\Warehouse\Controllers\DisbursementController::class, 'approve']);
        Route::post('disbursement/{disbursementRequest}/issue', [\App\Modules\Warehouse\Controllers\DisbursementController::class, 'issue']);
    });

});
