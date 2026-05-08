<?php

namespace App\Http\Controllers\Api;

use App\Models\ProgressSnapshot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProgressPhotoController extends Controller
{
    public function store(Request $request, ProgressSnapshot $snapshot)
    {
        if ($snapshot->user_id !== $request->user()->id) {
            abort(403);
        }

        $request->validate([
            'photo' => 'required|image|max:5120', // 5MB max
        ]);

        $path = $request->file('photo')->store('progress_photos', 's3');

        return response()->json([
            'message' => 'Photo uploaded successfully to S3',
            'url' => Storage::disk('s3')->url($path),
            'path' => $path
        ], 201);
    }
}
