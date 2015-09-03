<?php namespace App\Http\Controllers;

use Input;
use Request;
//use Illuminate\Http\Request;

class SearchResultController extends Controller {

	/*
	|--------------------------------------------------------------------------
	| SearchResultController
	|--------------------------------------------------------------------------
	|
	*/

	/**
	 * Create a new controller instance.
	 *
	 * @return void
	 */
	public function __construct()
	{
		//$this->middleware('auth');
	}

	/**
     * Show the application dashboard to the user.
     *
     * @param  Request  $request
     * @param  int  $id
     * @return Response
     */
	public function index(Request $request)
	{
		$searchParam = Request::input('q');
		return view('myway', ['values' => $searchParam]);
	}
}
