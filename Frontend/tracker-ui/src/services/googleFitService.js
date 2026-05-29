import api from '../api/axios';

/**
 * Simulate requesting Google Fit authorization.
 */
export async function connectGoogleFit() {
  await new Promise((resolve) => setTimeout(resolve, 1200)); // Simulate networking
  console.log('Google Fit Authorized');
  return true;
}

/**
 * Fetch simulated steps count.
 */
export async function getDailySteps() {
  const steps = Math.floor(Math.random() * 6000) + 5000; // 5k to 11k steps
  return steps;
}

/**
 * Fetch simulated heart rate samples.
 */
export async function getHeartRate() {
  const hr = Math.floor(Math.random() * 25) + 68; // 68 to 93 bpm
  return hr;
}

/**
 * Fetch simulated calories.
 */
export async function getCalories() {
  const calories = Math.floor(Math.random() * 400) + 150; // 150 to 550 kcal
  return calories;
}

/**
 * Fetch simulated sleep hours.
 */
export async function getSleepData() {
  const sleep = parseFloat((Math.random() * 3 + 5.5).toFixed(1)); // 5.5 to 8.5 hours
  return sleep;
}

/**
 * Synchronize wearable data to the Laravel backend API.
 */
export async function syncWearables(data) {
  return api.post('/wearables/google-fit', {
    steps: data.steps,
    heart_rate: data.heartRate,
    calories: data.calories,
    sleep_hours: data.sleep
  });
}
