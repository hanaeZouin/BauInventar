<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Equipment;
use Illuminate\Http\Request;

class EquipmentController extends Controller
{
    // Display all equipment with search, filters and pagination
    public function index(Request $request)
    {
        $query = Equipment::with('category');

        // Search by name or reference
        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('reference', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return response()->json(
            $query->latest()->paginate(10)
        );
    }

    // Store new equipment
    public function store(Request $request)
    {
        $validated = $request->validate([
            'reference' => 'required|string|max:255|unique:equipment,reference',
            'name' => 'required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'quantity' => 'required|integer|min:0',
            'location' => 'nullable|string|max:255',
            'status' => 'required|in:available,in_use,maintenance',
            'description' => 'nullable|string',
        ]);

        $equipment = Equipment::create($validated);

        return response()->json($equipment->load('category'), 201);
    }

    // Display one equipment
    public function show(Equipment $equipment)
    {
        return response()->json($equipment->load('category'));
    }

    // Update equipment
    public function update(Request $request, Equipment $equipment)
    {
        $validated = $request->validate([
            'reference' => 'sometimes|required|string|max:255|unique:equipment,reference,' . $equipment->id,
            'name' => 'sometimes|required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'quantity' => 'sometimes|required|integer|min:0',
            'location' => 'nullable|string|max:255',
            'status' => 'sometimes|required|in:available,in_use,maintenance',
            'description' => 'nullable|string',
        ]);

        $equipment->update($validated);

        return response()->json($equipment->load('category'));
    }

    // Delete equipment
    public function destroy(Equipment $equipment)
    {
        $equipment->delete();

        return response()->json([
            'message' => 'Equipment deleted successfully',
        ]);
    }
}
