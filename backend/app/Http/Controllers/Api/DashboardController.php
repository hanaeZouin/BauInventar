<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Equipment;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'total_equipment' => Equipment::count(),
            'total_categories' => Category::count(),
            'total_quantity' => Equipment::sum('quantity'),
            'available' => Equipment::where('status', 'available')->count(),
            'in_use' => Equipment::where('status', 'in_use')->count(),
            'maintenance' => Equipment::where('status', 'maintenance')->count(),
        ]);
    }
}