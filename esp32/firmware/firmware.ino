// ============================================
// ESP32 IoT Smart Drip Irrigation — Firmware
// ============================================
// Reads sensors → sends to backend → receives
// pump command → controls relay/MOSFET.
//
// All config is in config.h — edit that file
// for WiFi, pins, server URL, calibration, etc.
// ============================================

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include "config.h"

// ---- Initialize Sensors ----
DHT dht(DHT_PIN, DHT_TYPE);

// ---- State ----
bool pumpState = false;
bool backendReachable = true;
unsigned long lastSendTime = 0;

// ============================================
// SETUP
// ============================================
void setup() {
  Serial.begin(SERIAL_BAUD);
  delay(1000);

  debugPrint("\n🌱 ============================");
  debugPrint("   Xeno Garden - ESP32 Firmware");
  debugPrint("   ============================\n");

  // Pin modes
  pinMode(PUMP_PIN, OUTPUT);
  pinMode(RAIN_SENSOR_PIN, INPUT);
  pinMode(SOIL_MOISTURE_PIN, INPUT);
  pinMode(PH_SENSOR_PIN, INPUT);

  // Start with pump OFF
  digitalWrite(PUMP_PIN, PUMP_OFF);

  // Initialize DHT sensor
  dht.begin();

  // Connect to WiFi
  connectWiFi();
}

// ============================================
// MAIN LOOP
// ============================================
void loop() {
  unsigned long now = millis();

  // Reconnect WiFi if disconnected
  if (WiFi.status() != WL_CONNECTED) {
    debugPrint("⚠️  WiFi lost. Reconnecting...");
    connectWiFi();
  }

  // Send data every SEND_INTERVAL ms
  if (now - lastSendTime >= SEND_INTERVAL) {
    lastSendTime = now;

    // 1. Read all sensors
    float soilMoisture = readSoilMoisture();
    float temperature  = readTemperature();
    float humidity     = readHumidity();
    bool  rainDetected = readRainSensor();
    float phLevel      = readPH();

    // 2. Print readings
    debugPrint("📊 --- Sensor Readings ---");
    debugPrint("   Moisture:  " + String(soilMoisture, 1) + "%");
    debugPrint("   Temp:      " + String(temperature, 1) + "°C");
    debugPrint("   Humidity:  " + String(humidity, 1) + "%");
    debugPrint("   Rain:      " + String(rainDetected ? "YES" : "NO"));
    debugPrint("   pH:        " + String(phLevel, 1));

    // 3. Send to backend and get pump command
    String pumpCommand = sendToBackend(
      soilMoisture, temperature, humidity, rainDetected, phLevel
    );

    // 4. Control pump
    if (pumpCommand == "ON") {
      activatePump(true);
    } else if (pumpCommand == "OFF") {
      activatePump(false);
    } else if (pumpCommand == "FALLBACK") {
      // Backend unreachable — use local logic
      localFallbackLogic(soilMoisture, temperature, rainDetected);
    }

    debugPrint("🔌 Pump: " + String(pumpState ? "ON" : "OFF"));
    debugPrint("-------------------------\n");
  }
}

// ============================================
// SENSOR READING FUNCTIONS
// ============================================

float readSoilMoisture() {
  int raw = analogRead(SOIL_MOISTURE_PIN);

  // Map ADC value to 0-100% (inverted: dry = high ADC)
  float moisture = map(raw, SOIL_DRY_VALUE, SOIL_WET_VALUE, 0, 100);
  moisture = constrain(moisture, 0.0, 100.0);

  return moisture;
}

float readTemperature() {
  float temp = dht.readTemperature();
  if (isnan(temp)) {
    debugPrint("⚠️  DHT temperature read failed!");
    return -999.0; // Sentinel value
  }
  return temp;
}

float readHumidity() {
  float hum = dht.readHumidity();
  if (isnan(hum)) {
    debugPrint("⚠️  DHT humidity read failed!");
    return -999.0;
  }
  return hum;
}

bool readRainSensor() {
  // Most rain sensors: LOW = rain detected, HIGH = no rain
  return digitalRead(RAIN_SENSOR_PIN) == LOW;
}

float readPH() {
  int raw = analogRead(PH_SENSOR_PIN);

  // Convert ADC to voltage
  float voltage = (raw / (float)PH_ADC_RESOLUTION) * PH_REFERENCE_VOLTAGE;

  // Convert voltage to pH (linear calibration)
  float ph = 7.0 + ((2.5 - voltage) / (PH_REFERENCE_VOLTAGE / 14.0)) + PH_OFFSET;
  ph = constrain(ph, 0.0, 14.0);

  return ph;
}

// ============================================
// NETWORK FUNCTIONS
// ============================================

void connectWiFi() {
  debugPrint("📡 Connecting to WiFi: " + String(WIFI_SSID));
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    if (millis() - start > WIFI_TIMEOUT) {
      debugPrint("\n❌ WiFi connection timeout!");
      return;
    }
  }

  debugPrint("\n✅ WiFi connected!");
  debugPrint("   IP: " + WiFi.localIP().toString());
}

String sendToBackend(float moisture, float temp, float hum, bool rain, float ph) {
  if (WiFi.status() != WL_CONNECTED) {
    debugPrint("❌ WiFi not connected. Using fallback.");
    backendReachable = false;
    return "FALLBACK";
  }

  HTTPClient http;
  http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(HTTP_TIMEOUT);

  // Build JSON payload
  JsonDocument doc;
  doc["deviceId"]      = DEVICE_ID;
  doc["soil_moisture"]  = round(moisture * 10) / 10.0;
  doc["temperature"]    = round(temp * 10) / 10.0;
  doc["humidity"]       = round(hum * 10) / 10.0;
  doc["rain_status"]    = rain;
  doc["ph_level"]       = round(ph * 10) / 10.0;

  String jsonPayload;
  serializeJson(doc, jsonPayload);

  debugPrint("📤 Sending: " + jsonPayload);

  // Send POST request
  int httpCode = http.POST(jsonPayload);

  if (httpCode > 0) {
    String response = http.getString();
    debugPrint("📥 Response (" + String(httpCode) + "): " + response);

    backendReachable = true;

    // Parse pump command from response
    JsonDocument resDoc;
    DeserializationError error = deserializeJson(resDoc, response);

    if (!error && resDoc.containsKey("pump")) {
      String pump = resDoc["pump"].as<String>();
      http.end();
      return pump;
    }
  } else {
    debugPrint("❌ HTTP Error: " + String(httpCode));
    backendReachable = false;
  }

  http.end();
  return "FALLBACK";
}

// ============================================
// PUMP CONTROL
// ============================================

void activatePump(bool on) {
  pumpState = on;
  digitalWrite(PUMP_PIN, on ? PUMP_ON : PUMP_OFF);
}

// ============================================
// LOCAL FALLBACK (when backend is unreachable)
// ============================================

void localFallbackLogic(float moisture, float temp, bool rain) {
  debugPrint("🔄 Running local fallback logic...");

  if (moisture < FALLBACK_MOISTURE_LOW && temp > FALLBACK_TEMP_HIGH && !rain) {
    activatePump(true);
    debugPrint("🤖 LOCAL: Pump ON (moisture low, temp high, no rain)");
  } else if (moisture >= FALLBACK_MOISTURE_HIGH) {
    activatePump(false);
    debugPrint("🤖 LOCAL: Pump OFF (moisture sufficient)");
  }
}

// ============================================
// DEBUG HELPER
// ============================================

void debugPrint(String msg) {
  if (DEBUG_MODE) {
    Serial.println(msg);
  }
}
