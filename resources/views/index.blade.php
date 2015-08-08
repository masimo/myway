<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Home Page</title>

	<link href="{{ asset('/css/app.css') }}" rel="stylesheet">
	<link href="{{ asset('/css/home-style.css') }}" rel="stylesheet">
	<script src="{{ asset('/js/init.js') }}"></script>
</head>
<body>
	@yield('content')
</body>
</html>
