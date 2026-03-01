import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppContext } from "../context/AppContext";

const SettingsScreen = () => {
    const { thresholds, setThresholds, deviceId, setDeviceId } = useAppContext();

    const [localThresholds, setLocalThresholds] = useState({
        moistureLow: String(thresholds.moistureLow),
        moistureHigh: String(thresholds.moistureHigh),
        temperatureHigh: String(thresholds.temperatureHigh),
        phAlert: String(thresholds.phAlert),
    });
    const [localDeviceId, setLocalDeviceId] = useState(deviceId);

    const handleSave = () => {
        const parsed = {
            moistureLow: parseFloat(localThresholds.moistureLow),
            moistureHigh: parseFloat(localThresholds.moistureHigh),
            temperatureHigh: parseFloat(localThresholds.temperatureHigh),
            phAlert: parseFloat(localThresholds.phAlert),
        };

        // Validate
        for (const [key, value] of Object.entries(parsed)) {
            if (isNaN(value) || value < 0) {
                Alert.alert("Invalid Input", `Please enter a valid value for ${key}`);
                return;
            }
        }

        if (parsed.moistureLow >= parsed.moistureHigh) {
            Alert.alert(
                "Invalid Range",
                "Moisture Low must be less than Moisture High"
            );
            return;
        }

        setThresholds(parsed);
        setDeviceId(localDeviceId.trim());

        Alert.alert("✅ Settings Saved", "Thresholds have been updated successfully.", [
            { text: "OK" },
        ]);
    };

    const renderInput = (label, value, key, icon, unit) => (
        <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
                <Ionicons name={icon} size={18} color="#4FC3F7" />
                <Text style={styles.label}>{label}</Text>
                {unit && <Text style={styles.unit}>({unit})</Text>}
            </View>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={(text) =>
                    setLocalThresholds((prev) => ({ ...prev, [key]: text }))
                }
                keyboardType="numeric"
                placeholderTextColor="#555"
                placeholder="Enter value"
            />
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <Text style={styles.title}>⚙️ Settings</Text>

                {/* Device Config */}
                <Text style={styles.sectionTitle}>Device</Text>
                <View style={styles.card}>
                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <Ionicons name="hardware-chip" size={18} color="#4FC3F7" />
                            <Text style={styles.label}>Device ID</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            value={localDeviceId}
                            onChangeText={setLocalDeviceId}
                            placeholderTextColor="#555"
                            placeholder="e.g., esp32-field-01"
                        />
                    </View>
                </View>

                {/* Threshold Config */}
                <Text style={styles.sectionTitle}>Automation Thresholds</Text>
                <View style={styles.card}>
                    {renderInput(
                        "Moisture Low (Pump ON)",
                        localThresholds.moistureLow,
                        "moistureLow",
                        "water",
                        "%"
                    )}
                    {renderInput(
                        "Moisture High (Pump OFF)",
                        localThresholds.moistureHigh,
                        "moistureHigh",
                        "water",
                        "%"
                    )}
                    {renderInput(
                        "Temperature High",
                        localThresholds.temperatureHigh,
                        "temperatureHigh",
                        "thermometer",
                        "°C"
                    )}
                    {renderInput(
                        "pH Alert Threshold",
                        localThresholds.phAlert,
                        "phAlert",
                        "flask",
                        "pH"
                    )}
                </View>

                {/* Info Box */}
                <View style={styles.infoBox}>
                    <Ionicons name="information-circle" size={18} color="#4FC3F7" />
                    <Text style={styles.infoText}>
                        Pump turns ON when moisture {"<"} low threshold AND temp {">"} high
                        threshold AND no rain. Pump turns OFF when moisture {"≥"} high
                        threshold.
                    </Text>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                    activeOpacity={0.8}
                >
                    <Ionicons name="save" size={20} color="#FFF" />
                    <Text style={styles.saveText}>Save Settings</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#12121F",
    },
    scrollContent: {
        padding: 16,
        paddingTop: 50,
        paddingBottom: 40,
    },
    title: {
        color: "#FFF",
        fontSize: 28,
        fontWeight: "800",
        marginBottom: 24,
    },
    sectionTitle: {
        color: "#8E8EA0",
        fontSize: 13,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 10,
        marginTop: 8,
    },
    card: {
        backgroundColor: "#1E1E2E",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#2A2A3E",
    },
    inputGroup: {
        marginBottom: 16,
    },
    labelRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    label: {
        color: "#CCC",
        fontSize: 14,
        fontWeight: "600",
        marginLeft: 8,
    },
    unit: {
        color: "#8E8EA0",
        fontSize: 12,
        marginLeft: 6,
    },
    input: {
        backgroundColor: "#12121F",
        borderColor: "#2A2A3E",
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        color: "#FFF",
        fontSize: 16,
    },
    infoBox: {
        flexDirection: "row",
        backgroundColor: "#4FC3F710",
        borderRadius: 12,
        padding: 14,
        marginBottom: 20,
        alignItems: "flex-start",
    },
    infoText: {
        color: "#8E8EA0",
        fontSize: 13,
        lineHeight: 20,
        marginLeft: 10,
        flex: 1,
    },
    saveButton: {
        backgroundColor: "#4CAF50",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        borderRadius: 14,
        elevation: 4,
    },
    saveText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "700",
        marginLeft: 8,
    },
});

export default SettingsScreen;
