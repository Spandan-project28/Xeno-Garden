import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    Dimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useAppContext } from "../context/AppContext";

const screenWidth = Dimensions.get("window").width - 32;

const FILTERS = [
    { label: "24H", value: 48 },    // ~48 readings at 30s intervals = 24 min demo
    { label: "7 Days", value: 200 },
];

const HistoryScreen = () => {
    const { history, refreshHistory, loading, error } = useAppContext();
    const [activeFilter, setActiveFilter] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        refreshHistory(FILTERS[activeFilter].value);
    }, [activeFilter, refreshHistory]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refreshHistory(FILTERS[activeFilter].value);
        setRefreshing(false);
    }, [activeFilter, refreshHistory]);

    const handleFilterChange = (index) => {
        setActiveFilter(index);
    };

    // Prepare chart data from history (latest entries, reversed for chronological order)
    const chartData = [...history].reverse().slice(-20); // last 20 entries for readability

    const moistureData = {
        labels: chartData.map((_, i) => (i % 5 === 0 ? `${i + 1}` : "")),
        datasets: [
            {
                data: chartData.length > 0 ? chartData.map((r) => r.soil_moisture || 0) : [0],
                color: (opacity = 1) => `rgba(79, 195, 247, ${opacity})`,
                strokeWidth: 2,
            },
        ],
        legend: ["Soil Moisture (%)"],
    };

    const tempData = {
        labels: chartData.map((_, i) => (i % 5 === 0 ? `${i + 1}` : "")),
        datasets: [
            {
                data: chartData.length > 0 ? chartData.map((r) => r.temperature || 0) : [0],
                color: (opacity = 1) => `rgba(255, 112, 67, ${opacity})`,
                strokeWidth: 2,
            },
        ],
        legend: ["Temperature (°C)"],
    };

    const chartConfig = {
        backgroundColor: "#1E1E2E",
        backgroundGradientFrom: "#1E1E2E",
        backgroundGradientTo: "#1E1E2E",
        decimalCount: 1,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(142, 142, 160, ${opacity})`,
        style: { borderRadius: 16 },
        propsForDots: {
            r: "4",
            strokeWidth: "2",
        },
    };

    return (
        <View style={styles.container}>
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
                <Text style={styles.title}>📊 History</Text>

                {/* Filter Tabs */}
                <View style={styles.filterRow}>
                    {FILTERS.map((filter, index) => (
                        <TouchableOpacity
                            key={filter.label}
                            style={[
                                styles.filterTab,
                                activeFilter === index && styles.activeTab,
                            ]}
                            onPress={() => handleFilterChange(index)}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    activeFilter === index && styles.activeText,
                                ]}
                            >
                                {filter.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Error */}
                {error && (
                    <View style={styles.errorBanner}>
                        <Text style={styles.errorText}>⚠️ {error}</Text>
                    </View>
                )}

                {/* Loading */}
                {loading && !refreshing ? (
                    <ActivityIndicator
                        size="large"
                        color="#4FC3F7"
                        style={{ marginTop: 40 }}
                    />
                ) : chartData.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No historical data yet</Text>
                    </View>
                ) : (
                    <>
                        {/* Soil Moisture Chart */}
                        <Text style={styles.chartLabel}>Soil Moisture</Text>
                        <View style={styles.chartCard}>
                            <LineChart
                                data={moistureData}
                                width={screenWidth - 16}
                                height={220}
                                chartConfig={{
                                    ...chartConfig,
                                    propsForDots: {
                                        ...chartConfig.propsForDots,
                                        stroke: "#4FC3F7",
                                    },
                                }}
                                bezier
                                style={styles.chart}
                            />
                        </View>

                        {/* Temperature Chart */}
                        <Text style={styles.chartLabel}>Temperature</Text>
                        <View style={styles.chartCard}>
                            <LineChart
                                data={tempData}
                                width={screenWidth - 16}
                                height={220}
                                chartConfig={{
                                    ...chartConfig,
                                    propsForDots: {
                                        ...chartConfig.propsForDots,
                                        stroke: "#FF7043",
                                    },
                                }}
                                bezier
                                style={styles.chart}
                            />
                        </View>

                        {/* Data Count */}
                        <Text style={styles.dataCount}>
                            Showing {chartData.length} of {history.length} readings
                        </Text>
                    </>
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
    scrollContent: {
        padding: 16,
        paddingTop: 50,
    },
    title: {
        color: "#FFF",
        fontSize: 28,
        fontWeight: "800",
        marginBottom: 20,
    },
    filterRow: {
        flexDirection: "row",
        marginBottom: 20,
        backgroundColor: "#1E1E2E",
        borderRadius: 12,
        padding: 4,
    },
    filterTab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: "center",
        borderRadius: 10,
    },
    activeTab: {
        backgroundColor: "#4FC3F7",
    },
    filterText: {
        color: "#8E8EA0",
        fontWeight: "600",
        fontSize: 14,
    },
    activeText: {
        color: "#FFF",
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
    emptyState: {
        alignItems: "center",
        paddingTop: 60,
    },
    emptyText: {
        color: "#8E8EA0",
        fontSize: 16,
    },
    chartLabel: {
        color: "#8E8EA0",
        fontSize: 14,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 10,
    },
    chartCard: {
        backgroundColor: "#1E1E2E",
        borderRadius: 16,
        padding: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#2A2A3E",
        alignItems: "center",
    },
    chart: {
        borderRadius: 16,
    },
    dataCount: {
        color: "#555",
        fontSize: 12,
        textAlign: "center",
        marginBottom: 30,
    },
});

export default HistoryScreen;
