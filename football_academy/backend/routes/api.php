<?php

use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\PlayerController;
use App\Http\Controllers\Api\StaffController;
use App\Http\Controllers\Api\PartnerController;
use App\Http\Controllers\Api\TournamentController;
use Illuminate\Support\Facades\Route;

Route::get('/home', [HomeController::class, 'index']);
Route::get('/staff', [StaffController::class, 'index']);
Route::get('/partners', [PartnerController::class, 'index']);
Route::get('/players', [PlayerController::class, 'index']);
Route::get('/players/{player}', [PlayerController::class, 'show']);
Route::get('/gallery', [GalleryController::class, 'index']);
Route::get('/tournaments', [TournamentController::class, 'index']);
Route::post('/contact', [ContactController::class, 'send']);
