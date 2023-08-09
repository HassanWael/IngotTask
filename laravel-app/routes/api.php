<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post('/signup', [UserController::class, 'signUp']);
Route::post('/signin', [UserController::class, 'signIn']);
Route::get('/add_visitors', [UserController::class, 'add_visitors']);


Route::middleware(['auth:api'])->group(function () {
    Route::post('/get_user_referrers', [UserController::class, 'get_user_referrers']);
    Route::get('/user', [UserController::class, 'getUser']);
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/getRefferChart', [UserController::class, 'getRefferChart']);
});