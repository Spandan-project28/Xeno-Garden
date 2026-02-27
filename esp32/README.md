# 🌿 ESP32 Firmware — Xeno Garden

## Required Libraries (Install via Arduino IDE)

| Library | Install From |
|---------|-------------|
| **ArduinoJson** (v7+) | Library Manager → search "ArduinoJson" |
| **DHT sensor library** | Library Manager → search "DHT sensor library" by Adafruit |
| **Adafruit Unified Sensor** | Library Manager → search "Adafruit Unified Sensor" |

> **Board:** ESP32 Dev Module → Install via Board Manager → search "esp32"

## Wiring Diagram

```
ESP32 Pin    →    Component
─────────────────────────────────
GPIO 34      →    Soil Moisture Sensor (Analog OUT)
GPIO 35      →    pH Sensor (Analog OUT)
GPIO 4       →    DHT11 Data Pin
GPIO 5       →    Rain Sensor (Digital OUT)
GPIO 2       →    Relay/MOSFET Gate → 12V Pump
3.3V         →    Sensor VCC (DHT11, Rain)
5V           →    Soil Moisture VCC, pH VCC
GND          →    All sensor GNDs
```

## Setup Steps

1. Open `firmware/firmware.ino` in Arduino IDE
2. Edit `firmware/config.h`:
   - Set your **WiFi SSID & password**
   - Set your **backend server IP** (e.g., `192.168.0.171`)
   - Adjust **pin numbers** if wired differently
   - Calibrate **soil moisture** dry/wet ADC values
3. Select Board: **ESP32 Dev Module**
4. Select Port: Your ESP32's COM port
5. Upload!

## Files

| File | Purpose |
|------|---------|
| `config.h` | All configurable params — WiFi, pins, server, calibration |
| `firmware.ino` | Main logic — read sensors, POST to backend, control pump |

> **Tip:** Only edit `config.h` unless you're changing core logic.
