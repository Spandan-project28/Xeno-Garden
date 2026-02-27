// ============================================
// ESP32 IoT Drip Irrigation — Configuration
// ============================================
// Edit this file to change WiFi, pins, server,
// intervals, and thresholds. No need to touch
// firmware.ino unless changing core logic.
// ============================================

#ifndef CONFIG_H
#define CONFIG_H

// ---- WiFi Credentials ----
#define WIFI_SSID       "YOUR_WIFI_SSID"
#define WIFI_PASSWORD   "YOUR_WIFI_PASSWORD"

// ---- Backend Server ----
#define SERVER_URL      "http://192.168.0.171:5000/api/sensor-data"
#define DEVICE_ID       "esp32-field-01"

// ---- Timing (milliseconds) ----
#define SEND_INTERVAL   30000    // Send data every 30 seconds
#define WIFI_TIMEOUT    10000    // WiFi connection timeout
#define HTTP_TIMEOUT    10000    // HTTP request timeout

// ---- Sensor Pins ----
#define SOIL_MOISTURE_PIN   34   // Analog input (ADC1)
#define PH_SENSOR_PIN       35   // Analog input (ADC1)
#define DHT_PIN             4    // Digital GPIO
#define RAIN_SENSOR_PIN     5    // Digital GPIO (HIGH = no rain, LOW = rain)

// ---- DHT Sensor Type ----
// Change to DHT22 if using DHT22
#define DHT_TYPE            DHT11

// ---- Pump / Relay ----
#define PUMP_PIN            2    // Digital GPIO → MOSFET/Relay
#define PUMP_ON             HIGH // Set to LOW if relay is active-low
#define PUMP_OFF            LOW  // Set to HIGH if relay is active-low

// ---- Sensor Calibration ----
// Soil Moisture: raw ADC values (adjust based on your sensor)
#define SOIL_DRY_VALUE      4095  // ADC reading when completely dry
#define SOIL_WET_VALUE      1200  // ADC reading when fully wet

// pH Sensor: voltage-to-pH calibration
#define PH_OFFSET           0.00  // Calibration offset
#define PH_SLOPE            -5.70 // Calibration slope (default for common pH module)
#define PH_REFERENCE_VOLTAGE 3.3  // ESP32 ADC reference voltage
#define PH_ADC_RESOLUTION   4095  // 12-bit ADC

// ---- Local Fallback Thresholds ----
// Used when backend is unreachable
#define FALLBACK_MOISTURE_LOW    30   // Pump ON if below this
#define FALLBACK_MOISTURE_HIGH   40   // Pump OFF if above this
#define FALLBACK_TEMP_HIGH       30   // Pump ON if above this

// ---- Debug ----
#define SERIAL_BAUD         115200
#define DEBUG_MODE          true  // Set false to disable Serial prints

#endif
