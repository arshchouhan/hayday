<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AnimalController;

Route::prefix('farm')->group(function () {
    Route::get('/animals', [AnimalController::class, 'index']);
    Route::get('/animals/form-data', [AnimalController::class, 'getFormData']);
    Route::get('/animals/{id}', [AnimalController::class, 'show']);
    Route::post('/animals', [AnimalController::class, 'store']);
});