<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FacilityController;
use App\Http\Controllers\InspectionController;
use App\Http\Controllers\ComplaintController;

/*
|--------------------------------------------------------------------------
| API Routes - Smart Facility Management System
|--------------------------------------------------------------------------
| Architecture Flow:
| Request -> Route -> Controller -> Model -> Database (PostgreSQL) -> Response
|--------------------------------------------------------------------------
*/

// Health Check
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'database' => 'PostgreSQL',
        'timestamp' => now()->toIso8601String()
    ]);
});

// Facility Aggregate Stats (Dashboard metrics)
Route::get('/facilities/stats', [FacilityController::class, 'stats']);

// Resource Routes for Facilities, Inspections, and Complaints
Route::apiResource('facilities', FacilityController::class);
Route::apiResource('inspections', InspectionController::class);
Route::apiResource('complaints', ComplaintController::class);