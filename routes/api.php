<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;


Route::get('/api/tasks', [App\Http\Controllers\TaskController::class, 'apiIndex']);
Route::get('api/dashboard/stats', [DashboardController::class, 'getStats']);
