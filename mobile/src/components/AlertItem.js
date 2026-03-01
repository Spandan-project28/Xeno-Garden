import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ALERT_CONFIG = {
    PH_ALERT: {
        icon: "warning",
        color: "#F44336",
        bgColor: "#F4433615",
        borderColor: "#F4433640",
    },
    LOW_MOISTURE: {
        icon: "water-outline",
        color: "#FF9800",
        bgColor: "#FF980015",
        borderColor: "#FF980040",
    },
    SYSTEM: {
        icon: "settings",
        color: "#2196F3",
        bgColor: "#2196F315",
        borderColor: "#2196F340",
    },
};

const AlertItem = ({ alert }) => {
    const config = ALERT_CONFIG[alert.type] || ALERT_CONFIG.SYSTEM;
    const timestamp = new Date(alert.createdAt).toLocaleString();

    return (
        <View style={[styles.container, { backgroundColor: config.bgColor, borderColor: config.borderColor }]}>
            <View style={styles.header}>
                <View style={styles.typeRow}>
                    <Ionicons name={config.icon} size={20} color={config.color} />
                    <Text style={[styles.type, { color: config.color }]}>
                        {alert.type.replace("_", " ")}
                    </Text>
                </View>
                {alert.severity && (
                    <View style={[styles.severityBadge, { backgroundColor: config.color + "30" }]}>
                        <Text style={[styles.severityText, { color: config.color }]}>
                            {alert.severity}
                        </Text>
                    </View>
                )}
            </View>

            <Text style={styles.message}>{alert.message}</Text>

            <View style={styles.footer}>
                <Ionicons name="time-outline" size={14} color="#666" />
                <Text style={styles.timestamp}>{timestamp}</Text>
                {alert.isResolved && (
                    <View style={styles.resolvedBadge}>
                        <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
                        <Text style={styles.resolvedText}>Resolved</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    typeRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    type: {
        fontSize: 14,
        fontWeight: "700",
        marginLeft: 8,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    severityBadge: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 8,
    },
    severityText: {
        fontSize: 11,
        fontWeight: "700",
    },
    message: {
        color: "#CCC",
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 10,
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
    },
    timestamp: {
        color: "#666",
        fontSize: 12,
        marginLeft: 5,
    },
    resolvedBadge: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: "auto",
    },
    resolvedText: {
        color: "#4CAF50",
        fontSize: 12,
        fontWeight: "600",
        marginLeft: 4,
    },
});

export default AlertItem;
