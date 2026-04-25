<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AnimalController;

Route::get('/animals', [AnimalController::class, 'index']);
Route::get('/animals/form-data', [AnimalController::class, 'getFormData']);
Route::post('/animals', [AnimalController::class, 'store']);