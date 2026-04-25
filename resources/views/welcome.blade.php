<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        @php $path = request()->path(); @endphp
        @if (strpos($path, 'cow') !== false)
            <link rel="icon" type="image/svg+xml" href="{{ asset('js/assets/noun-cow-8349503.svg') }}" sizes="any" />
        @elseif (strpos($path, 'sheep') !== false)
            <link rel="icon" type="image/svg+xml" href="{{ asset('js/assets/noun-sheep-8349507.svg') }}" sizes="any" />
        @else
            <link rel="icon" type="image/svg+xml" href="{{ asset('js/assets/noun-hay-7549821.svg') }}" sizes="any" />
        @endif

        <title>{{ config('app.name', 'hayday') }}</title>
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/main.jsx'])
    </head>
    <body>
        <div id="app"></div>
    </body>
</html>
