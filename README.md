# 🌱 Xeno Garden — IoT Smart Drip Irrigation System

An IoT-enabled multi-parameter automated drip irrigation system with a Node.js backend and React Native mobile app.

## 🏗️ Architecture

```
ESP32 (Sensors + Pump)  →  WiFi  →  Backend API (Express + MongoDB)  →  Mobile App (React Native)
```

**Hardware:** ESP32, Soil Moisture Sensor, DHT11, Rain Sensor, pH Sensor, 12V Water Pump (MOSFET/Relay)

## 🤖 Automation Logic

| Rule | Condition | Action |
|------|-----------|--------|
| Pump ON | moisture < 30% AND temp > 30°C AND no rain | Start irrigation |
| Pump OFF | moisture ≥ 40% | Stop irrigation |
| pH Alert | pH < 6.0 | Generate PH_ALERT |
| Moisture Alert | moisture < 30% | Generate LOW_MOISTURE alert |

## 📁 Project Structure

```
├── backend/                    # Node.js + Express + MongoDB
│   ├── server.js               # Entry point
│   ├── app.js                  # Express app setup
│   ├── config/db.js            # MongoDB connection
│   ├── models/                 # Device, SensorReading, AlertLog
│   ├── controllers/            # Sensor, Pump, Alert controllers
│   ├── routes/                 # API routes
│   ├── services/               # Automation engine
│   ├── middleware/              # Error handler
│   └── utils/                  # Validators
│
├── mobile/                     # React Native (Expo SDK 54)
│   ├── App.js                  # Entry point
│   └── src/
│       ├── screens/            # Dashboard, History, Alerts, Settings
│       ├── components/         # SensorCard, PumpToggle, AlertItem
│       ├── services/           # API service (Axios)
│       ├── context/            # Global state (Context API)
│       ├── navigation/         # Bottom tab navigator
│       └── config/             # API config
```

## 🔌 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/sensor-data` | ESP32 sends readings → gets pump command |
| `GET` | `/api/sensor-data/latest` | Latest sensor reading |
| `GET` | `/api/sensor-data/history` | Paginated history |
| `POST` | `/api/pump/manual` | Manual pump ON/OFF |
| `GET` | `/api/pump/status` | Current pump state |
| `GET` | `/api/alerts` | All alerts |
| `PATCH` | `/api/alerts/:id/resolve` | Resolve an alert |
| `GET` | `/api/health` | Health check |

## 🚀 Quick Start

### Backend
```bash
cd backend
cp .env.example .env        # Configure MongoDB URI
npm install
npm run dev                  # http://localhost:5000
```

### Mobile App
```bash
cd mobile
npm install
npx expo start               # Scan QR with Expo Go
```

> Update `mobile/src/config/api.js` with your PC's local IP address.

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Expo Go app on your phone

## 📱 Mobile App Screens

| Screen | Features |
|--------|----------|
| **Dashboard** | Live sensor grid, pump toggle, auto-refresh every 10s |
| **History** | Line charts (moisture + temp), 24H/7D filters |
| **Alerts** | Color-coded alerts (PH in red, moisture in orange) |
| **Settings** | Configure thresholds + device ID |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| MCU | ESP32 (WiFi) |
| Backend | Node.js, Express, MongoDB, Mongoose |
| Mobile | React Native, Expo SDK 54, Axios |
| State | Context API |
| Charts | react-native-chart-kit |

## 📄 License

ISC
