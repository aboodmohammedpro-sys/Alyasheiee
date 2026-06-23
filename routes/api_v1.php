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

});
