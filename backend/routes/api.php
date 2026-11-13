<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\EquipmentController;
use App\Http\Controllers\Api\DashboardController;

Route::apiResource('categories', CategoryController::class);
Route::apiResource('equipment', EquipmentController::class);

Route::get('/dashboard', [DashboardController::class, 'index']);