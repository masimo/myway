<?php namespace App\Http\Controllers\AjaxModules;

use App\Http\Controllers\Controller;
use Input;
use Request;

class SuggestionsController extends Controller {
	private $client = null;

	/*
	|--------------------------------------------------------------------------
	| Home Controller
	|--------------------------------------------------------------------------
	|
	| This controller renders your application's "dashboard" for users that
	| are authenticated. Of course, you are free to change or remove the
	| controller as you wish. It is just here to get your app started!
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
	 * @return Response
	 */
	public function index()
	{
		if(Request::ajax()) {
			$data = Input::all();

			return json_encode($this->getSuggestions($data));
	    }
	}
	private function getSuggestions($data = null)
	{
		$result = array();

		if ($data !== null) {
			$client = $this->getClient();
			$res = $client->post('http://localhost:8080/criteria/2', array(), $data);
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
