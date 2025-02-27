<?php

use App\Http\Controllers\{CategoryController , DashboardController, TaskController};//grouped import
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::resource('tasks', TaskController::class);
Route::resource('categories', CategoryController::class);



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/api.php';
