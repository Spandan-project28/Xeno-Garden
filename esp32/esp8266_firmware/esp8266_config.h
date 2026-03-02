// ============================================
// ESP8266 IoT Drip Irrigation — Configuration
// ============================================
// XENO GARDEN — ESP8266 NodeMCU Version
//
// TESTING BUILD: 2 sensors only
//   1. Soil Moisture Sensor (A0)
//   2. Rain Sensor (D6 / GPIO 12)
//
// Edit WiFi credentials and server IP below.
// ============================================

#ifndef ESP8266_CONFIG_H
#define ESP8266_CONFIG_H

// ============================================
//  WiFi Credentials
// ============================================
// ⚠ ESP8266 only supports 2.4GHz WiFi!
// ⚠ Will NOT work on 5GHz networks!
#define WIFI_SSID       "T5-018"        // ← Change this
#define WIFI_PASSWORD   "t5018@123"     // ← Change this

// ============================================
//  Backend Server
// ============================================
// Replace with YOUR computer's IP address.
// To find your IP:
//   Windows: Open CMD → type "ipconfig" → look for IPv4 Address
//   Mac:     System Preferences → Network → IP Address
//   Linux:   Terminal → type "hostname -I"
//
// Example: "http://192.168.1.5:5000/api/sensor-data"
//
// ⚠ IMPORTANT: Your phone AND ESP8266 must be on
//    the SAME WiFi network as your computer!
#define SERVER_URL      "http://192.168.0.106:5000/api/sensor-data"  // ← Change this
#define DEVICE_ID       "esp8266-field-01"

// ============================================
//  Timing (milliseconds)
// ============================================
#define SEND_INTERVAL   3000     // Send data every 3 seconds (for testing)
#define WIFI_TIMEOUT    15000    // WiFi connection timeout
#define HTTP_TIMEOUT    10000    // HTTP request timeout

// ============================================
//  Sensor Pins — MUST match your wiring!
// ============================================
// NodeMCU Pin Label → GPIO Number:
//   D0 = GPIO16, D1 = GPIO5,  D2 = GPIO4
//   D3 = GPIO0,  D4 = GPIO2,  D5 = GPIO14
//   D6 = GPIO12, D7 = GPIO13, D8 = GPIO15
//   A0 = ADC0 (only analog pin, 10-bit: 0-1023)

#define SOIL_MOISTURE_PIN   A0      // Soil Moisture → A0 (analog)
#define RAIN_SENSOR_PIN     12      // Rain Sensor D0 → D6 (GPIO 12)

// ============================================
//  Sensor Calibration
// ============================================
// ESP8266 ADC is 10-bit (0–1023), NOT 12-bit like ESP32
// Adjust these values based on YOUR sensor:
//   - Hold sensor in AIR and note the reading → SOIL_DRY_VALUE
//   - Dip sensor in WATER and note the reading → SOIL_WET_VALUE
#define SOIL_DRY_VALUE      1024    // ADC reading when completely dry (air)
#define SOIL_WET_VALUE      300     // ADC reading when sensor is in water

// ============================================
//  Local Fallback Thresholds
// ============================================
// Used when backend server is unreachable
#define FALLBACK_MOISTURE_LOW    30   // Pump ON if soil moisture below 30%
#define FALLBACK_MOISTURE_HIGH   50   // Pump OFF if soil moisture above 50%

// ============================================
//  Debug Settings
// ============================================
#define SERIAL_BAUD         115200
#define DEBUG_MODE          true    // Set false to disable Serial prints

#endif
