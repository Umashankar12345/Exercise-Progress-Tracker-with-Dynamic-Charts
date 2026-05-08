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
