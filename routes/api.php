<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AnimalController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\WorkerController;
use App\Http\Controllers\InventoryController;

// Public auth routes (no middleware)
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected auth routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
});

// Protected farm routes
Route::prefix('farm')->middleware('auth:sanctum')->group(function () {
    Route::get('/animals', [AnimalController::class, 'index']);
    Route::get('/animals/paginated', [AnimalController::class, 'paginatedIndex']);
    Route::get('/animals/search', [AnimalController::class, 'search']);
    Route::get('/animals/form-data', [AnimalController::class, 'getFormData']);
    Route::get('/animals/{id}', [AnimalController::class, 'show']);
    Route::post('/animals', [AnimalController::class, 'store']);
    Route::put('/animals/{id}', [AnimalController::class, 'update']);

    // Location Management
    Route::get('/locations', [LocationController::class, 'index']);
    Route::post('/locations', [LocationController::class, 'store']);
    Route::get('/locations/{id}', [LocationController::class, 'show']);
    Route::put('/locations/{id}', [LocationController::class, 'update']);
    Route::delete('/locations/{id}', [LocationController::class, 'destroy']);
    Route::get('/health/animal/{animalId}', [HealthController::class, 'getByAnimal']);

    // General Activities (Breeding, Movement, Sales)
    Route::post('/activities/{hub}', [ActivityController::class, 'store']);
    Route::get('/animals/{animalId}/activity-summary', [ActivityController::class, 'getSummary']);
    Route::get('/animals/{animalId}/movement-history', [ActivityController::class, 'getMovementHistory']);
    Route::get('/animals/{animalId}/weight-history',   [ActivityController::class, 'getWeightHistory']);
    Route::get('/animals/{animalId}/cost-stats',       [ActivityController::class, 'getCostStats']);
    Route::get('/animals/{animalId}/timeline', [ActivityController::class, 'getTimeline']);

    // Group Management
    Route::get('/groups', [GroupController::class, 'index']);
    Route::post('/groups', [GroupController::class, 'store']);
    Route::get('/groups/{id}', [GroupController::class, 'show']);
    Route::put('/groups/{id}', [GroupController::class, 'update']);
    Route::delete('/groups/{id}', [GroupController::class, 'destroy']);

    // Worker Management
    Route::get('/workers', [WorkerController::class, 'index']);
    Route::post('/workers', [WorkerController::class, 'store']);
    Route::get('/workers/{id}', [WorkerController::class, 'show']);
    Route::put('/workers/{id}', [WorkerController::class, 'update']);
    Route::delete('/workers/{id}', [WorkerController::class, 'destroy']);

    // Inventory Management
    Route::get('/inventory', [InventoryController::class, 'index']);
    Route::post('/inventory', [InventoryController::class, 'store']);
    Route::post('/inventory/restock', [InventoryController::class, 'restock']);
    Route::delete('/inventory/{id}', [InventoryController::class, 'destroy']);
});