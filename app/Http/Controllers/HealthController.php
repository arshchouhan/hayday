<?php
/**
 * app/Http/Controllers/HealthController.php
 */

namespace App\Http\Controllers;

use App\Models\HealthRecord;
use App\Models\Animal;
use App\Models\Cattle;
use App\Models\Sheep;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class HealthController extends Controller
{
    /**
     * Store a new health record.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'animal_id'      => 'required|string',
            'type'           => 'required|string|in:observation,heat,pregnancy,bse,vaccination,treatment',
            'treatment_date' => 'required|date',
            'notes'          => 'nullable|string',
            // Flexible validation for other fields
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors()
            ], 422);
        }

        try {
            // Find the animal to ensure it exists
            $animal = $this->findAnimal($request->animal_id);
            if (!$animal) {
                return response()->json(['success' => false, 'message' => 'Animal not found'], 404);
            }

            $record = new HealthRecord();
            $record->fill($request->all());
            $record->save();

            Log::info("Health record ({$request->type}) saved for animal: {$request->animal_id}");

            $notifications = app(NotificationService::class);
            $notifications->createActivityNotification($request->user(), $animal, [
                'category' => 'health',
                'level' => in_array($request->type, ['treatment', 'observation'], true) ? 'warning' : 'info',
                'title' => ucfirst($request->type) . ' record saved',
                'message' => $this->buildHealthMessage($animal, $request->type),
                'action_url' => '/farm/activity/health/' . $animal->id,
                'metadata' => [
                    'event' => 'health_record',
                    'type' => $request->type,
                    'animal_id' => (string) $animal->id,
                ],
            ]);

            $notifications->syncAnimalAttentionNotifications($request->user(), $animal);

            return response()->json([
                'success' => true,
                'message' => ucfirst($request->type) . ' record saved successfully',
                'data'    => $record
            ], 201);

        } catch (\Exception $e) {
            Log::error("Failed to save health record: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while saving the record'
            ], 500);
        }
    }

    /**
     * Get health records for an animal.
     */
    public function getByAnimal($animalId)
    {
        $records = HealthRecord::where('animal_id', $animalId)
            ->orderBy('treatment_date', 'desc')
            ->get();

        return response()->json($records);
    }

    /**
     * Helper to find animal across collections.
     */
    private function findAnimal($id)
    {
        return Animal::find($id) ?? Cattle::find($id) ?? Sheep::find($id);
    }

    private function buildHealthMessage($animal, string $type): string
    {
        $animalLabel = $animal->ear_tag ?: $animal->animal_name ?: 'Animal ' . $animal->id;

        return "{$animalLabel} has a new {$type} record.";
    }
}
