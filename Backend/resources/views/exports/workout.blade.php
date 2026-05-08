<!DOCTYPE html>
<html>
<head>
    <title>Workout Export</title>
    <style>
        body { font-family: sans-serif; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h1>Workout: {{ $workout->name }}</h1>
    <p>Date: {{ $workout->started_at }}</p>
    
    @foreach($workout->workoutExercises as $we)
        <h3>Exercise: {{ $we->exercise->name ?? 'Unknown' }}</h3>
        <table>
            <thead>
                <tr>
                    <th>Set</th>
                    <th>Reps</th>
                    <th>Weight</th>
                </tr>
            </thead>
            <tbody>
                @foreach($we->workoutSets as $index => $set)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $set->reps }}</td>
                    <td>{{ $set->weight }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    @endforeach
</body>
</html>
