<?php namespace App\Http\Controllers;

use Input;
use Request;
//use Illuminate\Http\Request;

class SearchResultController extends Controller {
	private $client = null;

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
		$data = $this->getSuggestions($searchParam);
		return view('_pages/search/myway', ['values' => $data]);
	}
	private function getSuggestions($searchParam = null)
	{
		$result = array();
		$apiUrl = env("APP_API_URL");

		if ($searchParam !== null) {
			$client = $this->getClient();
			$res = $client->post($apiUrl . '/criteria/search', array(), $searchParam);
			$result = $res->getBody()->getContents();
		}
		
		return $result;
		
	}

	private function getClient()
	{
		if ($this->client === null) {
			$this->client = new \GuzzleHttp\Client();
		}
		return $this->client;
	}
}
