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

    // إدارة الوقود
    Route::prefix('fuel')->group(function () {
        Route::get('tanks', [\App\Modules\FuelManagement\Controllers\FuelController::class, 'getTanks']);
        Route::post('tanks', [\App\Modules\FuelManagement\Controllers\FuelController::class, 'storeTank']);
        Route::post('dispense', [\App\Modules\FuelManagement\Controllers\FuelController::class, 'dispense']);
    });

});
