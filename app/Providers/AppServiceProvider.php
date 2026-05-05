<?php

namespace App\Providers;

use Illuminate\Console\Events\CommandStarting;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use Throwable;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Force HTTPS scheme for generated URLs when APP_URL uses https.
        // This helps when the app is behind a proxy (Render) and generated
        // asset URLs would otherwise use the wrong scheme causing mixed
        // content issues in browsers.
        try {
            $appUrl = (string) config('app.url', '');
            if ($appUrl !== '' && str_starts_with($appUrl, 'https')) {
                URL::forceScheme('https');
            }
        } catch (Throwable $e) {
            // ignore
        }
        Event::listen(CommandStarting::class, function (CommandStarting $event): void {
            if ($event->command !== 'serve') {
                return;
            }

            $connectionName = (string) config('database.default', 'default');

            try {
                $connection = DB::connection($connectionName);

                if (method_exists($connection, 'getDatabase')) {
                    $connection->getDatabase()->command(['ping' => 1])->toArray();
                } else {
                    $connection->getPdo();
                }

                $event->output->writeln("<info>[DB] Connected ({$connectionName})</info>");
            } catch (Throwable $exception) {
                $message = strtok($exception->getMessage(), "\n") ?: 'Unknown error';
                $event->output->writeln("<error>[DB] Connection failed ({$connectionName}): {$message}</error>");
            }
        });
    }
}
