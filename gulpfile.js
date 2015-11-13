var elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Less
 | file for our application, as well as publishing vendor resources.
 |
 */
elixir.config.sourcemaps = false;

//JS
elixir(function(mix) {
	//marge libraries
	mix.scripts([
		"_lib/jquery-2.1.4.js",
		"_lib/underscore.js",
		"_lib/backbone.js",
		"_lib/bootstrap.min.js",
		"_lib/require.js",
		"_lib/jquery.ba-bbq.js"
	], 'public/js/_lib/init.js');

	//widgets
	mix.scripts("_widget/drop-down.widget.js", 'public/js/_widget/drop-down.widget.js');
	mix.scripts("_widget/search-result.widget.js", 'public/js/_widget/search-result.widget.js');
	
	//Pages
	mix.scripts("home_page.js", 'public/js/home_page.js');
	mix.scripts("search/search_result.js", 'public/js/search/search_result.js');
});	

//css compilation
elixir(function(mix) {
	//main config
	mix.less('app.less', 'public/css/app.css');
	mix.sass('_global/global-stuff.scss', 'public/css/_global/global-stuff.css');

	//single pages
	mix.sass('home-style.scss', 'public/css/home-style.css');
	mix.sass('search/search-page.scss', 'public/css/search/search-page.css');
	
	//widgets
	mix.sass('_widget/drop-down.widget.scss', 'public/css/_widget/drop-down.widget.css');
	mix.sass('_widget/search-result.widget.scss', 'public/css/_widget/search-result.widget.css');
});