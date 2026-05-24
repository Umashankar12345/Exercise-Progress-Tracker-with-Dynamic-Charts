<?php

namespace App\Http\Controllers;

use App\Models\SleepLog;
use App\Http\Requests\StoreSleepLogRequest;
use App\Http\Requests\UpdateSleepLogRequest;

class SleepLogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSleepLogRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(SleepLog $sleepLog)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SleepLog $sleepLog)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSleepLogRequest $request, SleepLog $sleepLog)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SleepLog $sleepLog)
    {
        //
    }
}
