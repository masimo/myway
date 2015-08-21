<head>
	<link href='http://fonts.googleapis.com/css?family=Roboto:400,500,700&subset=latin,cyrillic' rel='stylesheet' type='text/css'>
</head>

@extends('index')

@section('content')
<div class="main-box">
	<div class="container">
		<div class="container-fluid">
			<!-- <h1>прокладывай свой туристический путь <br> вместе с My way</h1> -->
			<div class="input-search-box">
				<div class="input-text-box">
					<input type="text" class="search-field" placeholder='Введите текст'>	
				</div>
				<input type="button" class="submit-search"></input>
			</div>
			<div class="main-button-box">
				<!-- <a class="top-route">Популярные маршруты</a>
				<a class="latest-route">Последние маршруты</a> -->
			</div>
		</div>
	</div>
	<section class="main-body-container">
		<!-- <h2 class="title-road">
			Новые маршруты
		</h2> -->
		<div class="grid-items"></div>
		<div class="places-outer-box"></div>
	</section>
	<footer class="main-footer-box"></footer>
</div>
<script src="{{ asset('/js/script.js') }}"></script>
@endsection
