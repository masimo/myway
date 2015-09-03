@extends('index')

@section('head-stuff')
	<link href="{{ asset('/css/home-style.css') }}" rel="stylesheet">
@endsection

@section('content')
<div class="main-search-box">
	@for ($i = 0; $i < sizeof($values); $i++)
	    The current value is {{ $values[$i] }}
	@endfor
</div>
<script src="{{ asset('/js/script.js') }}"></script>
@endsection