<?php namespace App\Http\Controllers;

use Input;
use Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;


use \GuzzleHttp\Client;

use Illuminate\Routing\Route;


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

	protected function getOptions()
	{
		$options = array();
		return $options;
	}

	protected function encodeData($data)
	{
		return $data;
	}
	
	protected function decodeData($data)
	{
		return $data;
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
		$data = Request::input('q');

		$url = "/criteria/search";
		$apiBaseUrl = env("APP_API_URL");



		$result = $this->postUri(array(
			"criteries_ids" => $data
		), $apiBaseUrl . $url);
		return view('_pages/search/myway', ['values' => $result]);
	}

	private function postUri(   $data, $url,
                                $extraOptions = null,
                                $extraHeaders = null,
                                $successStatuses = null,
                                $timeout = null,
                                $connTimeout = null,
                                $userAgent = null)
    {
        $result = array();
        $client = new Client();

        $options = $this->mergeOptions($this->getOptions(), $extraOptions);
        $headers = $this->mergeHeaders($this->getHttpHeaders(), $extraHeaders);
    
        if ($data !== null) {
            try {
                $res = $client->post($url, [
                    'headers' => $headers,
                    'json' => $data
                ]);
                $result = $res->getBody();

            } catch (ClientException $e) {
                return $e->getResponse()->getBody();
            }
        }
        
        return $result;
        
    }

    final private function mergeOptions($options, $extraOptions)
    {
        if(is_array($extraOptions))
        {
            foreach ( $extraOptions as $key => $value )
                $options[$key] = $value;
        }
        
        return $options;
    }

    final private function mergeHeaders($headers, $extraHeaders)
    {
        if(is_array($extraHeaders))
        {
            foreach ( $extraHeaders as $key => $value )
                $headers[$key] = $value;
        }
        
        return $headers;
    }

    protected function getHttpHeaders()
    {
        $headers = array(
             'Content-Type' => "application/json",
             'Accept' => 'application/json'
        );

        return $headers;
    }
}
