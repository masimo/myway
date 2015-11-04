<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="_token" content="{!! csrf_token() !!}"/>
	<link href="{{ asset('/css/app.css') }}" rel="stylesheet">
	<script src="{{ asset('/js/_lib/init.js') }}"></script>
	@yield('head-stuff')
</head>
<body>
	@yield('content')
	
	@yield('js-stuff')
</body>
</html>