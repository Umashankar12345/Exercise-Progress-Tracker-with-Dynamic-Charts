<?php

namespace App\Http\Controllers\Api;

use App\Models\WearableData;
use App\Events\WearableUpdated;
use Illuminate\Http\Request;

class WearableController extends Controller
{
    /**
     * Store synced wearable data and broadcast the change.
     */
    public function store(Request $request)
    {
        $data = WearableData::create([
            'user_id' => auth()->id(),
            'steps' => $request->steps ?? 0,
            'heart_rate' => $request->heart_rate,
            'calories' => $request->calories ?? 0,
            'sleep_hours' => $request->sleep_hours ?? 0,
        ]);

        broadcast(new WearableUpdated($data));

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }
}
