# Interview Answer: Building the AI Coaching Engine

**Question:** How did you implement real-time workout analysis in your application, rather than just building a standard data storage system?

**Answer:**
To move this project beyond a standard CRUD application, I engineered an asynchronous, AI-driven coaching engine using Laravel and the Anthropic Claude API. 

Here is how the architecture handles real-time analysis seamlessly:

1. **Non-Blocking Architecture (`AnalyzeWorkoutJob`):**
   When a user logs a workout, the system doesn't just save it to MySQL. The `WorkoutController` immediately dispatches an `AnalyzeWorkoutJob` to a background queue. This ensures the user's API request remains lightning-fast (under 100ms) without waiting for a third-party AI service to respond.

2. **Context-Aware Prompting (`AIService.php`):**
   Inside the background job, the system dynamically queries the user's last 30 days of workout history—aggregating exercises, sets, reps, and weights. This historical context is injected into the `AIService`. The service instructs Claude to analyze volume trends and recovery patterns, demanding a strictly formatted JSON response containing a `tip`, a `warning` (e.g., detecting plateaus or overtraining), and a specific `recommendation`.

3. **Performance & Caching (Redis):**
   To ensure scalability and minimize Claude API costs, the parsed JSON response is immediately cached in Redis with a 24-hour TTL mapped to the specific user's ID. 

4. **Real-Time UI Updates:**
   On the frontend, the React application securely polls the `/api/ai/insights` endpoint. Because the Laravel `AIController` serves this directly from the Redis cache, the AI Coach Panel renders instantly, providing the user with actionable, highly-personalized feedback based on their latest session.

This approach transforms the application from a passive tracker into a proactive, intelligent fitness coach.

---

## Interview Answer: Dynamic Progress Charts

**Question:** How did you implement the dynamic progress charts (Volume Trends, 1RM Estimates, and Muscle Radar)?

**Answer:**
To provide users with actionable visual feedback on their fitness journey, I built a robust data pipeline that connects a Laravel backend service to interactive React components using Recharts.

Here is how the data flows from the database to the UI:

1. **Data Aggregation (`ProgressService.php`):**
   Instead of performing complex calculations on the frontend or within the controller, I abstracted the logic into a dedicated `ProgressService`. When the `GET /api/progress/chart` endpoint is hit, this service queries the user's historical `WorkoutSet` data. It aggregates total volume (weight × reps) per week and applies the Epley formula to estimate the user's One-Rep Max (1RM) for key exercises over time.

2. **Muscle Group Distribution:**
   The `ProgressService` also groups the volume data by the `muscle_group` attribute defined on the `Exercise` model. This calculates the exact percentage of total volume dedicated to each muscle (e.g., Chest: 30%, Legs: 45%), ensuring the user can visualize their training balance and prevent overtraining specific areas.

3. **Frontend Visualization (Recharts):**
   On the frontend, the React application fetches this structured JSON payload. I utilized the `Recharts` library to render this data dynamically:
   - **Volume & 1RM Trend:** A responsive `LineChart` plots the weekly volume and the estimated 1RM trend on a dual-axis graph, allowing users to see if progressive overload is occurring.
   - **Muscle Radar:** The muscle distribution data is passed into a custom `MuscleRadar` component (using Recharts `RadarChart` or progress bars) to visually represent the user's muscle balance.

This separation of concerns ensures the frontend remains lightweight and focused solely on rendering, while the backend handles the heavy lifting of data aggregation and mathematical estimations.
