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
	mix.less('home-style.less', 'public/css/home-style.css');
});
elixir(function(mix) {
	mix.less('app.less', 'public/css/app.css');
});
elixir(function(mix) {
	mix.scripts([
		"script.js"
	], 'public/js/script.js');
});
elixir(function(mix) {
	mix.scripts([
		"_lib/underscore.js",
		"_lib/jquery-2.1.4.js",
		"_lib/backbone.js",
		"_lib/bootstrap.min.js"
	], 'public/js/_lib/init.js');
});