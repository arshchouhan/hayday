<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\InventoryHistory;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $userId = \Illuminate\Support\Facades\Auth::id();
        if (!$userId) {
            $demoUser = \App\Models\User::where('email', 'demo@gmail.com')->first();
            $userId = $demoUser ? $demoUser->id : null;
        }

        $type = $request->query('type', 'Feed');
        if ($type === 'History') {
            return InventoryHistory::whereHas('inventory', function($q) use ($userId) {
                $q->where('user_id', $userId);
            })->with('inventory')->latest()->get();
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
        ]);

        $validated['quantity'] = 0; // Initialize empty
        
        $userId = \Illuminate\Support\Facades\Auth::id();
        if (!$userId) {
            $demoUser = \App\Models\User::where('email', 'demo@gmail.com')->first();
            $userId = $demoUser ? $demoUser->id : null;
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

    public function restock(Request $request)
    {
        $validated = $request->validate([
            'inventory_id' => 'required|string',
            'quantity_added' => 'required|numeric',
            'cost' => 'nullable|numeric',
            'supplier' => 'nullable|string',
            'purchase_date' => 'required|date',
            'purchased_by' => 'nullable|string',
        ]);

        $item = Inventory::findOrFail($validated['inventory_id']);
        
        // Update stock
        $item->increment('quantity', $validated['quantity_added']);
        $item->update([
            'last_purchase_date' => $validated['purchase_date'],
            'supplier' => $validated['supplier'] ?? $item->supplier
        ]);

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
