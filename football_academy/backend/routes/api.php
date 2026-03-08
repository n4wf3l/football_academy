<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\PlayerController;
use App\Http\Controllers\Api\StaffController;
use App\Http\Controllers\Api\PartnerController;
use App\Http\Controllers\Api\SiteSettingsController;
use App\Http\Controllers\Api\TournamentController;
use Illuminate\Support\Facades\Route;

// Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/settings', [SiteSettingsController::class, 'index']);
    Route::put('/settings', [SiteSettingsController::class, 'update']);

    // File upload
    Route::post('/upload', [\App\Http\Controllers\Api\UploadController::class, 'store']);

    // Player CRUD (admin)
    Route::post('/players', [\App\Http\Controllers\Api\PlayerController::class, 'store']);
    Route::put('/players/{player}', [\App\Http\Controllers\Api\PlayerController::class, 'update']);
    Route::delete('/players/{player}', [\App\Http\Controllers\Api\PlayerController::class, 'destroy']);

    // Training sessions CRUD
    Route::post('/training-sessions', [\App\Http\Controllers\Api\TrainingSessionController::class, 'store']);
    Route::put('/training-sessions/{trainingSession}', [\App\Http\Controllers\Api\TrainingSessionController::class, 'update']);
    Route::delete('/training-sessions/{trainingSession}', [\App\Http\Controllers\Api\TrainingSessionController::class, 'destroy']);
    Route::post('/training-sessions/reorder', [\App\Http\Controllers\Api\TrainingSessionController::class, 'reorder']);

    // Partner CRUD (admin)
    Route::post('/partners', [PartnerController::class, 'store']);
    Route::put('/partners/{partner}', [PartnerController::class, 'update']);
    Route::delete('/partners/{partner}', [PartnerController::class, 'destroy']);

    // Gallery CRUD (admin)
    Route::post('/gallery', [GalleryController::class, 'store']);
    Route::put('/gallery/{galleryItem}', [GalleryController::class, 'update']);
    Route::delete('/gallery/{galleryItem}', [GalleryController::class, 'destroy']);

    // Tournament CRUD (admin)
    Route::post('/tournaments', [TournamentController::class, 'store']);
    Route::put('/tournaments/{tournament}', [TournamentController::class, 'update']);
    Route::delete('/tournaments/{tournament}', [TournamentController::class, 'destroy']);

    // Staff CRUD (admin)
    Route::post('/staff', [StaffController::class, 'store']);
    Route::put('/staff/{staff}', [StaffController::class, 'update']);
    Route::delete('/staff/{staff}', [StaffController::class, 'destroy']);
});

// Public routes
Route::get('/home', [HomeController::class, 'index']);
Route::get('/staff', [StaffController::class, 'index']);
Route::get('/partners', [PartnerController::class, 'index']);
Route::get('/players', [PlayerController::class, 'index']);
Route::get('/players/{player}', [PlayerController::class, 'show']);
Route::get('/gallery', [GalleryController::class, 'index']);
Route::get('/tournaments', [TournamentController::class, 'index']);
Route::post('/contact', [ContactController::class, 'send']);
Route::get('/training-sessions', [\App\Http\Controllers\Api\TrainingSessionController::class, 'index']);
Route::get('/settings/public', [SiteSettingsController::class, 'index']);
