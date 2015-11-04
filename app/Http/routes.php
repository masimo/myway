<?php
/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/
Route::get('/', 'HomeController@index');

//Search URLs
Route::group(['prefix' => 'search'], function()
{
	Route::get('myway', 'SearchResultController@index');
});

//ajax URLs
Route::group(['prefix' => 'AjaxModules'], function()
{
    Route::post('suggestions', 'AjaxModules\SuggestionsController@index');
    Route::post('search', 'AjaxModules\SearchController@index');
});

Route::get('home', function () {
    return view('welcome');
});