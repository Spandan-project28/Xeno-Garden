import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ICON_MAP = {
    soil_moisture: { name: "water", color: "#4FC3F7" },
    temperature: { name: "thermometer", color: "#FF7043" },
    humidity: { name: "cloud", color: "#81C784" },
    rain_status: { name: "rainy", color: "#5C6BC0" },
    ph_level: { name: "flask", color: "#FFB74D" },
    pump_status: { name: "power", color: "#E91E63" },
};

const SensorCard = ({ label, value, unit, type }) => {
    const icon = ICON_MAP[type] || { name: "analytics", color: "#999" };

    const displayValue =
        typeof value === "boolean"
            ? value
                ? "Yes"
                : "No"
            : value !== null && value !== undefined
                ? String(value)
                : "--";

    return (
        <View style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: icon.color + "20" }]}>
                <Ionicons name={icon.name} size={28} color={icon.color} />
            </View>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.valueRow}>
                <Text style={styles.value}>{displayValue}</Text>
                {unit ? <Text style={styles.unit}>{unit}</Text> : null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#1E1E2E",
        borderRadius: 16,
        padding: 16,
        width: "47%",
        marginBottom: 14,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#2A2A3E",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    iconContainer: {
        width: 52,
        height: 52,
        borderRadius: 26,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    label: {
        color: "#8E8EA0",
        fontSize: 12,
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    valueRow: {
        flexDirection: "row",
        alignItems: "baseline",
    },
    value: {
        color: "#FFFFFF",
        fontSize: 24,
        fontWeight: "700",
    },
    unit: {
        color: "#8E8EA0",
        fontSize: 14,
        marginLeft: 3,
        fontWeight: "500",
    },
});

export default SensorCard;
