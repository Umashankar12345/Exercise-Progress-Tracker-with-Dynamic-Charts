<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function streak(Request $request)
    {
        // Mock calculation of consecutive workout days
        return response()->json([
            'streak' => 3
        ]);
    }
}
