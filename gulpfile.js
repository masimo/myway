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

elixir(function(mix) {
	mix.less('app.less', 'public/css/app.css');
	mix.less('home-style.less', 'public/css/home-style.css');
	
	mix.sass('drop-down.widget.scss', 'public/css/drop-down.widget.css');
	mix.sass('search-result.widget.scss', 'public/css/search-result.widget.css');
	
	mix.scripts([
		"_lib/jquery-2.1.4.js",
		"_lib/underscore.js",
		"_lib/backbone.js",
		"_lib/bootstrap.min.js",
		"_lib/require.js"
	], 'public/js/_lib/init.js');

	mix.scripts("_widget/drop-down.widget.js", 'public/js/_widget/drop-down.widget.js');
	mix.scripts("home_page.js", 'public/js/home_page.js');
	mix.scripts("search/search_result.js", 'public/js/search/search_result.js');
});	