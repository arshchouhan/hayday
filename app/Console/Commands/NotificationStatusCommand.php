<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class NotificationStatusCommand extends Command
{
    protected $signature = 'notifications:status';

    protected $description = 'Check which notification service is active';

    public function handle(): int
    {
        $driver = (string) config('services.notifications.driver', 'laravel');
        $this->info('Notifications Service: ' . $driver);

        if ($driver === 'java') {
            $url = (string) config('services.notifications.java_url', 'http://localhost:8080');
            $this->info('Java API URL: ' . $url);

            try {
                $response = Http::timeout(5)->acceptJson()->get(rtrim($url, '/') . '/actuator/health');
                $response->throw();

                $status = $response->json('status', 'unknown');
                $this->info('Java service status: ' . $status);

                return self::SUCCESS;
            } catch (\Throwable $exception) {
                $this->error('Java service unavailable: ' . $exception->getMessage());

                return self::FAILURE;
            }
        }

        $this->info('Using Laravel database for notifications');

        return self::SUCCESS;
    }
}
