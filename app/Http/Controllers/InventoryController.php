<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\InventoryHistory;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->query('type', 'Feed');
        if ($type === 'History') {
            return InventoryHistory::with('inventory')->latest()->get();
        }
        return Inventory::where('type', $type)->get();
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
        $item = Inventory::create($validated);
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

        return response()->json([
            'item' => $item,
            'history' => $history
        ], 200);
    }

    public function destroy($id)
    {
        $item = Inventory::findOrFail($id);
        $item->history()->delete();
        $item->delete();
        return response()->json(null, 204);
    }
}
