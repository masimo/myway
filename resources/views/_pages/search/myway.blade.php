@extends('index')

@section('head-stuff')
	<link href="{{ asset('/css/home-style.css') }}" rel="stylesheet">
	<link href="{{ asset('/css/search-result.widget.css') }}" rel="stylesheet">
@endsection

@section('content')
@for ($i = 0; $i < sizeof($values); $i++)
    The current value is {{ $values[$i] }}
@endfor
<div class="search-field-wrapper"></div>
<div class="main-search-result-box">
	<div class="search-inner-box">
		<div class="column-wrapper col-1">
			<div class="one-item-wrapper">
				<div class="img-box">
					<img src="https://lh3.googleusercontent.com/-VO3Pz_V6fn4/VV9HPxvsNFI/AAAAAAAAAhc/zYPRGkwmEcQ/s203-k-no/" alt="">
				</div>
				<h3 class="item-title">Title</h3>
				<div class="descr-wrapper">Often he would be surrounded by an eager circle, all waiting to be served; holding boat-spades, pike-heads, harpoons, and lances, and jealously watching his every sooty movement, as he toiled. Nevertheless, this old man's was a patient hammer wielded by a patient arm. </div>
			</div>
		</div>
	</div>
</div>
<script src="{{ asset('/js/search/search_result.js') }}"></script>
@endsection