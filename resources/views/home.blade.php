@extends('index')
@include('search-field')
@include('footer')

@section('head-stuff')
	<title>Home Page</title>
	<link href='http://fonts.googleapis.com/css?family=Roboto:400,500,700&subset=latin,cyrillic' rel='stylesheet' type='text/css'>
	<link href="{{ asset('/css/home-style.css') }}" rel="stylesheet">
	<link href="{{ asset('/css/_widget/drop-down.widget.css') }}" rel="stylesheet">
@endsection

@section('js-stuff')
	<script src="{{ asset('/js/home_page.js') }}"></script>
	<script src="{{ asset('/js/_widget/drop-down.widget.js') }}"></script>
@endsection
@section('content')
<div class="main-box">
	<div class="container">
		<div class="container-field">
			<h1>прокладывай свой туристический путь <br> вместе с My way</h1>
			@yield('search-field')
			<div class="main-button-box">
				<a class="rate-ways-btn active">Популярные маршруты</a>
				<a class="rate-ways-btn">Последние маршруты</a>
			</div>
		</div>
	</div>
	<section class="main-body-container">
		<h2 class="title-road">
			Новые маршруты
		</h2>
		<div class="grid-items"></div>
		<div class="places-outer-box"></div>
	</section>
</div>
@yield('footer-stuff')
@endsection