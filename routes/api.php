<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes Hierarchy
|--------------------------------------------------------------------------
*/

// V1 Routes inclusion
require __DIR__ . '/api_v1.php';

// Future V2 can be added here
// require __DIR__ . '/api_v2.php';

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
