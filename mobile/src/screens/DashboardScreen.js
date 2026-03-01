import React, { useEffect, useCallback, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
    StatusBar,
} from "react-native";
import { useAppContext } from "../context/AppContext";
import SensorCard from "../components/SensorCard";
import PumpToggle from "../components/PumpToggle";
import config from "../config/api";

const DashboardScreen = () => {
    const { sensorData, refreshSensorData, togglePump, error } = useAppContext();
    const [refreshing, setRefreshing] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    // Initial load + auto-refresh every 10s
    useEffect(() => {
        const loadData = async () => {
            await refreshSensorData();
            setInitialLoading(false);
        };
        loadData();

        const interval = setInterval(refreshSensorData, config.DASHBOARD_REFRESH);
        return () => clearInterval(interval);
    }, [refreshSensorData]);

    // Pull to refresh
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refreshSensorData();
        setRefreshing(false);
    }, [refreshSensorData]);

    if (initialLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4FC3F7" />
                <Text style={styles.loadingText}>Connecting to sensors...</Text>
            </View>
        );
    }

    const data = sensorData;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#12121F" />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#4FC3F7"
                        colors={["#4FC3F7"]}
                    />
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>🌱 Dashboard</Text>
                    <View style={styles.statusDot}>
                        <View
                            style={[
                                styles.dot,
                                { backgroundColor: data ? "#4CAF50" : "#F44336" },
                            ]}
                        />
                        <Text style={styles.statusText}>
                            {data ? "Live" : "Offline"}
                        </Text>
                    </View>
                </View>

                {/* Error Banner */}
                {error && (
                    <View style={styles.errorBanner}>
                        <Text style={styles.errorText}>⚠️ {error}</Text>
                    </View>
                )}

                {/* Sensor Cards Grid */}
                <View style={styles.grid}>
                    <SensorCard
                        label="Soil Moisture"
                        value={data?.soil_moisture?.toFixed(1)}
                        unit="%"
                        type="soil_moisture"
                    />
                    <SensorCard
                        label="Temperature"
                        value={data?.temperature?.toFixed(1)}
                        unit="°C"
                        type="temperature"
                    />
                    <SensorCard
                        label="Humidity"
                        value={data?.humidity?.toFixed(1)}
                        unit="%"
                        type="humidity"
                    />
                    <SensorCard
                        label="Rain"
                        value={data?.rain_status}
                        type="rain_status"
                    />
                    <SensorCard
                        label="pH Level"
                        value={data?.ph_level?.toFixed(1)}
                        type="ph_level"
                    />
                    <SensorCard
                        label="Pump"
                        value={data?.pump_status || "OFF"}
                        type="pump_status"
                    />
                </View>

                {/* Pump Control */}
                <Text style={styles.sectionTitle}>Pump Control</Text>
                <PumpToggle
                    pumpStatus={data?.pump_status || "OFF"}
                    onToggle={togglePump}
                />

                {/* Last Updated */}
                {data?.createdAt && (
                    <Text style={styles.lastUpdated}>
                        Last updated: {new Date(data.createdAt).toLocaleTimeString()}
                    </Text>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#12121F",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#12121F",
    },
    loadingText: {
        color: "#8E8EA0",
        fontSize: 16,
        marginTop: 12,
    },
    scrollContent: {
        padding: 16,
        paddingTop: 50,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },
    title: {
        color: "#FFF",
        fontSize: 28,
        fontWeight: "800",
    },
    statusDot: {
        flexDirection: "row",
        alignItems: "center",
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 6,
    },
    statusText: {
        color: "#8E8EA0",
        fontSize: 14,
        fontWeight: "600",
    },
    errorBanner: {
        backgroundColor: "#F4433620",
        borderColor: "#F4433640",
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
    },
    errorText: {
        color: "#F44336",
        fontSize: 14,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    sectionTitle: {
        color: "#8E8EA0",
        fontSize: 14,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginTop: 10,
        marginBottom: 12,
    },
    lastUpdated: {
        color: "#555",
        fontSize: 12,
        textAlign: "center",
        marginTop: 16,
        marginBottom: 30,
    },
});

export default DashboardScreen;
