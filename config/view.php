<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default View Storage Paths
    |--------------------------------------------------------------------------
    |
    | Most templating systems load templates from disk. Here you may specify
    | an array of paths that should be checked for your views. Of course
    | the usual Laravel view path has already been registered for you.
    |
    */

    'paths' => [
        resource_path('views'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Compiled View Path
    |--------------------------------------------------------------------------
    |
    | This option determines where all the compiled Blade templates will be
    | stored for your application. Typically, this is within the storage
    | directory. However, as usual, you are free to change this value.
    |
    */

    'compiled' => env(
        'VIEW_COMPILED_PATH',
        storage_path('framework/views')
    ),

    /*
    |--------------------------------------------------------------------------
    | Component Namespace
    |--------------------------------------------------------------------------
    |
    | This value is here so that you can easily use Blade components in your
    | application without specifying a full namespace.
    |
    */

    'relative_hash' => env('VIEW_RELATIVE_HASH', false),

    'compiled_extension' => env('VIEW_COMPILED_EXTENSION', 'php'),

    'namespaces' => [
        'mail' => resource_path('views/vendor/mail'),
    ],

];