@extends('index')
@include('footer')
@include('search-field')

@section('head-stuff')
	<script id="globalVariable" type="text/javascript">
		define('C.global', function() {
			return function global() {
				return {!! $values !!}
			};
		});
		$('#globalVariable').remove();
	</script>
	<link href="{{ asset('/css/search/search-page.css') }}" rel="stylesheet">
	<link href="{{ asset('/css/_widget/search-result.widget.css') }}" rel="stylesheet">
	<link href="{{ asset('/css/_widget/drop-down.widget.css') }}" rel="stylesheet">
@endsection

@section('js-stuff')
	<script src="{{ asset('/js/search/search_result.js') }}"></script>
	<script src="{{ asset('/js/_widget/search-result.widget.js') }}"></script>
	<script src="{{ asset('/js/_widget/drop-down.widget.js') }}"></script>
@endsection

@section('content')
<div class="search-outer-box">
	@yield('search-field')
</div>
<section class="main-search-result-box">
	<div class="search-inner-box">
		<div class="column-wrapper col-1 hidden">
			<div class="one-item-wrapper">
				<div class="img-box">
					<img src="https://lh3.googleusercontent.com/-VO3Pz_V6fn4/VV9HPxvsNFI/AAAAAAAAAhc/zYPRGkwmEcQ/s203-k-no/" alt="">
				</div>
				<h3 class="item-title">Title</h3>
				<div class="descr-wrapper">Often he would be surrounded by an eager circle, all waiting to be served; holding boat-spades, pike-heads, harpoons, and lances, and jealously watching his every sooty movement, as he toiled. Nevertheless, this old man's was a patient hammer wielded by a patient arm. </div>
			</div>
		</div>
		<div class="column-wrapper col-1 hidden">
			<div class="one-item-wrapper">
				<div class="img-box">
					<img src="https://lh3.googleusercontent.com/-VO3Pz_V6fn4/VV9HPxvsNFI/AAAAAAAAAhc/zYPRGkwmEcQ/s203-k-no/" alt="">
				</div>
				<h3 class="item-title">Title</h3>
				<div class="descr-wrapper">Often he would be surrounded by an eager circle, all waiting to be served; holding boat-spades, pike-heads, harpoons, and lances, and jealously watching his every sooty movement, as he toiled. Nevertheless, this old man's was a patient hammer wielded by a patient arm. </div>
			</div>
		</div>
		<div class="column-wrapper col-1 hidden">
			<div class="one-item-wrapper">
				<div class="img-box">
					<img src="https://lh3.googleusercontent.com/-VO3Pz_V6fn4/VV9HPxvsNFI/AAAAAAAAAhc/zYPRGkwmEcQ/s203-k-no/" alt="">
				</div>
				<h3 class="item-title">Title</h3>
				<div class="descr-wrapper">Often he would be surrounded by an eager circle, all waiting to be served; holding boat-spades, pike-heads, harpoons, and lances, and jealously watching his every sooty movement, as he toiled. Nevertheless, this old man's was a patient hammer wielded by a patient arm. </div>
			</div>
		</div>
	</div>
</section>

@yield('footer-stuff')

@endsection