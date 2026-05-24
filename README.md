# Exercise Progress Tracker with Dynamic Charts

A modern, professional, and fully dynamic fitness tracking SaaS built with a decoupled architecture. This platform allows users to log workouts, track custom exercises, and visualize their progress dynamically through responsive charts—all powered by a real-time, multi-tenant backend.

## 🚀 Key Features

- **100% Dynamic Visualizations:** All dashboard charts (Area Charts, Progress Bars, Muscle Balance) are powered by real-time aggregations from the backend database.
- **Smart Exercise Logging:** Search through a global catalog of exercises or dynamically create custom exercises on the fly using a robust `<datalist>` input.
- **Automated PR Tracking:** The backend calculates and displays true Personal Records (PRs) by querying your absolute maximum weight lifted for every specific exercise.
- **Multi-Tenant Security:** Built with strict Object-Level Authorization (BOLA/IDOR protection) to ensure users can only ever access or modify their own workout data.
- **Real-Time Capabilities:** Configured for Laravel Reverb and Pusher for instant WebSocket notifications and AI-driven insights.

## 🛠️ Technology Stack

**Frontend**
- **React 18** (Vite)
- **TailwindCSS** (Premium glassmorphic UI)
- **Recharts** (Dynamic data visualization)
- **Axios** (Configured with Bearer Token Auth)
- **Lucide React** (SVG Iconography)

**Backend**
- **Laravel 11** (PHP 8.2)
- **SQLite Database** (Lightweight and portable)
- **Laravel Sanctum** (Secure API Authentication)
- **Laravel Reverb** (WebSockets/Real-time capabilities)

## 📦 System Architecture & Data Flow
This application utilizes a strict decoupled Client-Server architecture communicating via a RESTful JSON API.

1. **Authentication:** Uses Laravel Sanctum to generate secure stateful Bearer tokens for all subsequent requests.
2. **Data Ingestion:** When a workout is logged, the backend automatically validates the request, resolves custom exercises dynamically, and securely links the data to the authenticated user's ID.
3. **Data Aggregation:** Heavy calculations (like summing 7-day rolling volumes and calculating muscle group percentages) are offloaded to complex SQL queries on the backend, ensuring the React frontend remains lightning fast.

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Umashankar12345/Exercise-Progress-Tracker-with-Dynamic-Charts.git
cd Exercise-Progress-Tracker-with-Dynamic-Charts
```

### 2. Backend Setup (Laravel)
```bash
cd Backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --force
php artisan serve
```

### 3. Frontend Setup (React/Vite)
```bash
cd ../Frontend/tracker-ui
npm install
```
Create a `.env` file in the frontend root and add your WebSocket credentials (if applicable):
```env
VITE_REVERB_APP_KEY=your_key
VITE_REVERB_HOST=localhost
VITE_REVERB_PORT=8080
VITE_REVERB_SCHEME=http
```
```bash
npm run dev
```

## 🛡️ Security Posture
- Route parameters are fully validated.
- `AuthorizesRequests` trait enforces strict ownership policies across all controllers.
- The global exercise library is restricted to admin modification only, preventing unauthorized catalog poisoning.

---
*Built for scale, designed for performance.*