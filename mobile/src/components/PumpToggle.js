import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PumpToggle = ({ pumpStatus, onToggle }) => {
    const [toggling, setToggling] = useState(false);
    const isOn = pumpStatus === "ON";

    const handleToggle = async () => {
        try {
            setToggling(true);
            await onToggle(isOn ? "OFF" : "ON");
        } catch (err) {
            // Error handled by context
        } finally {
            setToggling(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.statusRow}>
                <Ionicons
                    name={isOn ? "water" : "water-outline"}
                    size={24}
                    color={isOn ? "#4FC3F7" : "#666"}
                />
                <Text style={styles.statusText}>
                    Pump is{" "}
                    <Text style={[styles.statusBadge, isOn ? styles.on : styles.off]}>
                        {isOn ? "ON" : "OFF"}
                    </Text>
                </Text>
            </View>

            <TouchableOpacity
                style={[
                    styles.button,
                    isOn ? styles.buttonOff : styles.buttonOn,
                    toggling && styles.buttonDisabled,
                ]}
                onPress={handleToggle}
                disabled={toggling}
                activeOpacity={0.7}
            >
                {toggling ? (
                    <ActivityIndicator color="#FFF" size="small" />
                ) : (
                    <>
                        <Ionicons
                            name={isOn ? "power" : "power"}
                            size={20}
                            color="#FFF"
                            style={{ marginRight: 8 }}
                        />
                        <Text style={styles.buttonText}>
                            Turn {isOn ? "OFF" : "ON"}
                        </Text>
                    </>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1E1E2E",
        borderRadius: 16,
        padding: 20,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#2A2A3E",
    },
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    statusText: {
        color: "#CCC",
        fontSize: 16,
        marginLeft: 10,
        fontWeight: "500",
    },
    statusBadge: {
        fontWeight: "800",
        fontSize: 18,
    },
    on: {
        color: "#4CAF50",
    },
    off: {
        color: "#F44336",
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        borderRadius: 12,
    },
    buttonOn: {
        backgroundColor: "#4CAF50",
    },
    buttonOff: {
        backgroundColor: "#F44336",
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "700",
    },
});

export default PumpToggle;
