<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Monthly Performance Report</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #1f2937;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
        }
        .header {
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .title {
            font-size: 24px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: -0.5px;
            color: #3b82f6;
            margin: 0;
        }
        .subtitle {
            font-size: 12px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            margin-top: 5px;
        }
        .stats-grid {
            width: 100%;
            margin-bottom: 30px;
        }
        .stat-card {
            background-color: #f9fafb;
            border: 1px solid #f3f4f6;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
        }
        .stat-label {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            color: #6b7280;
            letter-spacing: 0.5px;
        }
        .stat-value {
            font-size: 22px;
            font-weight: 800;
            color: #111827;
            margin-top: 5px;
        }
        .section-title {
            font-size: 14px;
            font-weight: 800;
            text-transform: uppercase;
            color: #111827;
            border-left: 3px solid #3b82f6;
            padding-left: 10px;
            margin-bottom: 15px;
            margin-top: 25px;
        }
        .exercise-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .exercise-table th {
            background-color: #f9fafb;
            text-align: left;
            padding: 10px;
            font-size: 10px;
            font-weight: 700;
            color: #6b7280;
            text-transform: uppercase;
            border-bottom: 1px solid #e5e7eb;
        }
        .exercise-table td {
            padding: 12px 10px;
            font-size: 12px;
            font-weight: 600;
            border-bottom: 1px solid #f3f4f6;
        }
        .badge {
            background-color: #eff6ff;
            color: #2563eb;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 700;
        }
        .chart-container {
            text-align: center;
            margin-top: 20px;
            margin-bottom: 30px;
        }
        .chart-img {
            max-width: 100%;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }
        .footer {
            margin-top: 50px;
            border-top: 1px solid #f3f4f6;
            padding-top: 15px;
            font-size: 9px;
            color: #9ca3af;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="header">
        <table style="width: 100%;">
            <tr>
                <td>
                    <h1 class="title">FitTrack AI</h1>
                    <div class="subtitle">Monthly Performance Report &bull; {{ $monthName }}</div>
                </td>
                <td style="text-align: right; font-size: 12px; color: #6b7280; font-weight: 500;">
                    Athlete: <strong>{{ $userName }}</strong>
                </td>
            </tr>
        </table>
    </div>

    <table class="stats-grid" style="width: 100%;">
        <tr>
            <td style="width: 33%; padding-right: 10px;">
                <div class="stat-card">
                    <div class="stat-label">Total Workouts</div>
                    <div class="stat-value">{{ $totalWorkouts }}</div>
                </div>
            </td>
            <td style="width: 33%; padding-left: 5px; padding-right: 5px;">
                <div class="stat-card">
                    <div class="stat-label">Volume Moved</div>
                    <div class="stat-value">{{ number_format($totalVolume) }} kg</div>
                </div>
            </td>
            <td style="width: 33%; padding-left: 10px;">
                <div class="stat-card">
                    <div class="stat-label">PRs Achieved</div>
                    <div class="stat-value">{{ $prsAchieved }}</div>
                </div>
            </td>
        </tr>
    </table>

    <div class="section-title">Top Exercises this Month</div>
    <table class="exercise-table">
        <thead>
            <tr>
                <th>Exercise</th>
                <th style="text-align: right;">Sessions Tracked</th>
                <th style="text-align: right;">Focus Rate</th>
            </tr>
        </thead>
        <tbody>
            @forelse($topExercises as $exercise)
                <tr>
                    <td>{{ $exercise->name }}</td>
                    <td style="text-align: right;"><span class="badge">{{ $exercise->sessions }} Sessions</span></td>
                    <td style="text-align: right; color: #10b981;">Peak Target Achieved</td>
                </tr>
            @empty
                <tr>
                    <td colspan="3" style="text-align: center; color: #9ca3af; padding: 20px;">No workout sessions completed in this period.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    @if($chartImage)
        <div class="section-title">Volume Progression Chart</div>
        <div class="chart-container">
            <img class="chart-img" src="{{ $chartImage }}" alt="Progress Chart">
        </div>
    @endif

    <div class="footer">
        Generated automatically by FitTrack AI on {{ $generatedAt }}. Confidential &bull; Personal Health Record.
    </div>
</body>
</html>
