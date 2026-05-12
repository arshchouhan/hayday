<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\InventoryHistory;
use App\Models\Animal;
use App\Models\Cattle;
use App\Models\Sheep;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $userId = \Illuminate\Support\Facades\Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $type = $request->query('type', 'Feed');
        if ($type === 'History') {
            return InventoryHistory::whereHas('inventory', function($q) use ($userId) {
                $q->where('user_id', $userId);
            })->with('inventory')->latest()->get();
        }

        // Auto-ensure default items exist for the user if they don't have them
        if ($type === 'Feed') {
            $defaults = ['Hay', 'Silage', 'Grain', 'Grass', 'Supplements'];
            foreach ($defaults as $name) {
                Inventory::firstOrCreate(
                    ['user_id' => (string)$userId, 'name' => $name, 'type' => 'Feed'],
                    ['unit' => 'kg', 'quantity' => 0]
                );
            }
        }

        return Inventory::where('user_id', $userId)->where('type', $type)->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string',
            'subtype' => 'nullable|string',
            'unit' => 'required|string',
            'capacity' => 'nullable|numeric',
        ]);

        $validated['quantity'] = $validated['capacity'] ?? 0;
        
        $userId = \Illuminate\Support\Facades\Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $validated['user_id'] = $userId;

        $item = Inventory::create($validated);

        app(NotificationService::class)->logActivityCreated($request->user(), 'inventory item', $item->name, [
            'category' => 'activity',
            'level' => 'info',
            'action_url' => '/farm/inventory',
            'metadata' => [
                'event' => 'inventory_created',
                'inventory_id' => (string) $item->getKey(),
                'type' => $item->type,
            ],
        ]);

        return response()->json($item, 201);
    }

    public function update(Request $request, $id)
    {
        $item = Inventory::findOrFail($id);
        $item->update($request->all());

        if ($request->has('quantity')) {
            app(NotificationService::class)->logActivityRecorded($request->user(), 'inventory update', $item->name, [
                'category' => 'activity',
                'level' => 'info',
                'action_url' => '/farm/inventory',
                'metadata' => [
                    'event' => 'inventory_updated',
                    'inventory_id' => (string) $item->getKey(),
                    'new_quantity' => $item->quantity,
                ],
            ]);
        }

        return response()->json($item);
    }

    public function restock(Request $request)
    {
        $validated = $request->validate([
            'inventory_id' => 'required|string',
            'quantity_added' => 'required|numeric',
            'cost' => 'nullable|numeric',
            'supplier' => 'nullable|string',
            'purchase_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $item = Inventory::findOrFail($validated['inventory_id']);
        
        // Update stock
        $item->increment('quantity', (float)$validated['quantity_added']);
        $item->update([
            'last_purchase_date' => $validated['purchase_date'],
            'supplier' => $validated['supplier'] ?? $item->supplier
        ]);

        // Calculate cost per animal for reflection in stats
        // We'll store this in the history so we can sum it up for any animal
        $animalCount = Animal::count() + Cattle::count() + Sheep::count();
        $validated['cost_per_animal'] = $animalCount > 0 ? ($validated['cost'] ?? 0) / $animalCount : 0;
        $validated['user_id'] = \Illuminate\Support\Facades\Auth::id();

        // Log history
        $history = InventoryHistory::create($validated);

        app(NotificationService::class)->logActivityRecorded($request->user(), 'inventory restock', $item->name, [
            'category' => 'activity',
            'level' => 'info',
            'action_url' => '/farm/inventory',
            'metadata' => [
                'event' => 'inventory_restocked',
                'inventory_id' => (string) $item->getKey(),
                'quantity_added' => $validated['quantity_added'],
                'cost' => $validated['cost'] ?? 0,
            ],
        ]);

        return response()->json([
            'item' => $item,
            'history' => $history
        ], 200);
    }

    public function destroy($id)
    {
        $item = Inventory::findOrFail($id);
        $itemName = $item->name;
        $item->history()->delete();
        $item->delete();

        app(NotificationService::class)->logActivityDeleted(request()->user(), 'inventory item', $itemName, [
            'category' => 'activity',
            'level' => 'warning',
            'action_url' => '/farm/inventory',
            'metadata' => [
                'event' => 'inventory_deleted',
                'inventory_id' => (string) $id,
            ],
        ]);

        return response()->json(null, 204);
    }
}
