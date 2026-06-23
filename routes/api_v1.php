<?php

use Illuminate\Support\Facades\Route;
use App\Modules\ProjectManagement\Controllers\ProjectController;

Route::prefix('v1')->group(function () {
    
    // مشاريع المقاولات
    Route::apiResource('projects', ProjectController::class);

});
