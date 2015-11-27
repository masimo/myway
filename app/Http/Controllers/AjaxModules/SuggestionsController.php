<?php namespace App\Http\Controllers\AjaxModules;

use Input;
use App\Http\Requests;
use App\Http\Controllers\Controller;


use \GuzzleHttp\Client;

use Illuminate\Http\Request;
use Illuminate\Routing\Route;

class SuggestionsController extends Controller {
	
	const DEFAULT_LINK = 'http://echo.jsontest.com';
	const DEFAULT_LINK2 = 'http://ip.jsontest.com';
	const DEFAULT_SUB_LINK = '/key/books/one/two';
	const DEFAULT_SUB_LINK2 = '/key/books/one/two';
	
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
	 * @return Response
	 */
	public function index(Request $request)
	{
			$data = Input::all();
			
			$url = "/criteria/autosuggest";
			$apiBaseUrl = env("APP_API_URL");

			$rusult = $this->postUri($data, $apiBaseUrl . $url);
			
			return $rusult;
   
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
