// ================================================================
// XENO GARDEN — ESP8266 NodeMCU Firmware
// ================================================================
// TESTING BUILD: 2 sensors only
//
// This firmware is specifically for the ESP8266 (NodeMCU)
// with only 2 sensors for initial testing:
//
//   • Soil Moisture Sensor → A0  (Analog)
//   • Rain Sensor Module   → D6  (Digital, GPIO 12)
//
// No DHT11 or LCD in this setup.
//
// It reads the sensors, connects to your WiFi, and sends
// data to the Xeno Garden backend API every 10 seconds.
//
// SETUP INSTRUCTIONS:
//   1. Open esp8266_config.h
//   2. Set your WiFi name and password
//   3. Set your computer's IP address in SERVER_URL
//   4. Upload this sketch to your NodeMCU
//   5. Open Serial Monitor at 115200 baud
// ================================================================

// ---- Libraries ----
#include <ESP8266WiFi.h>          // ESP8266 WiFi
#include <ESP8266HTTPClient.h>    // HTTP client for sending data
#include <WiFiClient.h>           // WiFi client for HTTP
#include <ArduinoJson.h>          // JSON builder for API requests
#include "esp8266_config.h"       // Our pin/WiFi/server settings

// ---- State Variables ----
WiFiClient wifiClient;
bool backendReachable = false;
unsigned long lastSendTime = 0;
int sendCount = 0;               // Track how many times we sent data
int failCount = 0;               // Track failed sends

// ================================================================
//  SETUP — Runs once when ESP8266 powers on
// ================================================================
void setup() {
  // Start Serial Monitor
  Serial.begin(SERIAL_BAUD);
  delay(1000);

  Serial.println();
  Serial.println("========================================");
  Serial.println("  🌱 XENO GARDEN — ESP8266 Firmware");
  Serial.println("  TESTING MODE: 2 Sensors Only");
  Serial.println("  Soil Moisture (A0) + Rain (D6)");
  Serial.println("========================================");
  Serial.println();

  // ---- Initialize Pins ----
  pinMode(RAIN_SENSOR_PIN, INPUT);
  // A0 doesn't need pinMode on ESP8266

  Serial.println("✅ Soil Moisture sensor ready (Pin A0)");
  Serial.println("✅ Rain sensor ready (Pin D6 / GPIO 12)");

  // ---- Connect to WiFi ----
  connectWiFi();

  Serial.println();
  Serial.println("🚀 Setup complete! Starting sensor loop...");
  Serial.println("   Sending data every " + String(SEND_INTERVAL / 1000) + " seconds");
  Serial.println("========================================\n");
}

// ================================================================
//  MAIN LOOP — Runs forever
// ================================================================
void loop() {
  unsigned long now = millis();

  // ---- Reconnect WiFi if disconnected ----
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("⚠️  WiFi disconnected! Reconnecting...");
    connectWiFi();
  }

  // ---- Send data at regular intervals ----
  if (now - lastSendTime >= SEND_INTERVAL) {
    lastSendTime = now;
    sendCount++;

    // 1. Read sensors
    float soilMoisture = readSoilMoisture();
    bool  rainDetected = readRainSensor();

    // 2. Print readings to Serial Monitor
    Serial.println("📊 ─── Sensor Reading #" + String(sendCount) + " ───");
    Serial.println("   Soil Moisture: " + String(soilMoisture, 1) + "%");
    Serial.println("   Rain:          " + String(rainDetected ? "YES ☔" : "NO ☀️"));

    // 3. Send to backend API
    bool sent = sendToBackend(soilMoisture, rainDetected);

    if (sent) {
      Serial.println("   ✅ Data sent to app successfully!");
    } else {
      Serial.println("   ❌ Failed to send (fail #" + String(failCount) + ")");
    }

    Serial.println("─────────────────────────────────\n");
  }
}

// ================================================================
//  SENSOR READING FUNCTIONS
// ================================================================

float readSoilMoisture() {
  int raw = analogRead(SOIL_MOISTURE_PIN);

  // ESP8266 ADC is 10-bit: 0–1023
  // Dry soil = HIGH value,  Wet soil = LOW value
  // Map to percentage: 0% = dry, 100% = wet
  float moisture = (float)(SOIL_DRY_VALUE - raw) / (float)(SOIL_DRY_VALUE - SOIL_WET_VALUE) * 100.0;
  moisture = constrain(moisture, 0.0, 100.0);

  if (DEBUG_MODE) {
    Serial.println("   [DEBUG] Soil raw ADC: " + String(raw) + " → " + String(moisture, 1) + "%");
  }

  return moisture;
}

bool readRainSensor() {
  // Rain sensor D0 output:
  // LOW = rain detected, HIGH = no rain
  return digitalRead(RAIN_SENSOR_PIN) == LOW;
}

// ================================================================
//  WIFI CONNECTION
// ================================================================

void connectWiFi() {
  Serial.println("📡 Connecting to WiFi: " + String(WIFI_SSID));
  Serial.println("   ⚠ Remember: ESP8266 only supports 2.4GHz!");

  WiFi.mode(WIFI_STA);            // Station mode (client)
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  unsigned long start = millis();
  int dots = 0;

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    dots++;

    if (dots % 40 == 0) Serial.println();  // New line every 20 seconds

    if (millis() - start > WIFI_TIMEOUT) {
      Serial.println();
      Serial.println("❌ WiFi connection FAILED after " + String(WIFI_TIMEOUT / 1000) + " seconds!");
      Serial.println("   CHECK:");
      Serial.println("   1. Is the WiFi name correct? → \"" + String(WIFI_SSID) + "\"");
      Serial.println("   2. Is the password correct?");
      Serial.println("   3. Is it a 2.4GHz network? (5GHz won't work!)");
      Serial.println("   4. Is the router nearby?");
      return;
    }
  }

  Serial.println();
  Serial.println("✅ WiFi connected successfully!");
  Serial.println("   Network:  " + String(WIFI_SSID));
  Serial.println("   IP Address: " + WiFi.localIP().toString());
  Serial.println("   Signal:   " + String(WiFi.RSSI()) + " dBm");
}

// ================================================================
//  SEND DATA TO BACKEND API
// ================================================================

bool sendToBackend(float moisture, bool rain) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("   ❌ Cannot send — WiFi not connected");
    backendReachable = false;
    failCount++;
    return false;
  }

  HTTPClient http;
  http.begin(wifiClient, SERVER_URL);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(HTTP_TIMEOUT);

  // ---- Build JSON payload ----
  // Matches the backend validator:
  //   deviceId, soil_moisture, temperature, humidity, rain_status, ph_level
  //
  // Since we only have 2 sensors for testing, we send:
  //   - Real soil_moisture from the sensor
  //   - Real rain_status from the sensor
  //   - Default values for temperature (25.0), humidity (50.0), ph_level (7.0)
  JsonDocument doc;
  doc["deviceId"]       = DEVICE_ID;
  doc["soil_moisture"]  = round(moisture * 10) / 10.0;
  doc["temperature"]    = 25.0;   // Default — no DHT11 sensor connected
  doc["humidity"]       = 50.0;   // Default — no DHT11 sensor connected
  doc["rain_status"]    = rain;
  doc["ph_level"]       = 7.0;    // Default — no pH sensor connected

  String jsonPayload;
  serializeJson(doc, jsonPayload);

  Serial.println("   📤 Sending to: " + String(SERVER_URL));
  Serial.println("   📤 Payload: " + jsonPayload);

  // ---- Send POST request ----
  int httpCode = http.POST(jsonPayload);

  if (httpCode > 0) {
    String response = http.getString();
    Serial.println("   📥 Response (" + String(httpCode) + "): " + response);

    backendReachable = true;

    // Check if backend sent a pump command
    JsonDocument resDoc;
    DeserializationError error = deserializeJson(resDoc, response);

    if (!error && resDoc.containsKey("pump")) {
      String pumpCmd = resDoc["pump"].as<String>();
      Serial.println("   🔌 Pump command from app: " + pumpCmd);
    }

    http.end();
    return true;
  } else {
    Serial.println("   ❌ HTTP Error: " + String(httpCode));
    Serial.println("   CHECK:");
    Serial.println("   1. Is your backend server running? (npm start)");
    Serial.println("   2. Is SERVER_URL correct in esp8266_config.h?");
    Serial.println("   3. Are ESP8266 and PC on the same WiFi?");
    backendReachable = false;
    failCount++;
  }

  http.end();
  return false;
}
