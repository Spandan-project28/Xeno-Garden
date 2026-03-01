import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    ActivityIndicator,
} from "react-native";
import { useAppContext } from "../context/AppContext";
import AlertItem from "../components/AlertItem";

const AlertsScreen = () => {
    const { alerts, refreshAlerts, loading, error } = useAppContext();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        refreshAlerts();
    }, [refreshAlerts]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refreshAlerts();
        setRefreshing(false);
    }, [refreshAlerts]);

    const renderItem = ({ item }) => <AlertItem alert={item} />;

    const renderEmpty = () => (
        <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>✅</Text>
            <Text style={styles.emptyTitle}>No Alerts</Text>
            <Text style={styles.emptySubtitle}>
                Everything is running smoothly
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>🚨 Alerts</Text>
                <View style={styles.countBadge}>
                    <Text style={styles.countText}>{alerts.length}</Text>
                </View>
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
            ) : (
                <FlatList
                    data={alerts}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#4FC3F7"
                            colors={["#4FC3F7"]}
                        />
                    }
                    ListEmptyComponent={renderEmpty}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#12121F",
        paddingHorizontal: 16,
        paddingTop: 50,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        color: "#FFF",
        fontSize: 28,
        fontWeight: "800",
    },
    countBadge: {
        backgroundColor: "#F44336",
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginLeft: 12,
    },
    countText: {
        color: "#FFF",
        fontSize: 14,
        fontWeight: "700",
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
    list: {
        paddingBottom: 30,
    },
    emptyState: {
        alignItems: "center",
        paddingTop: 80,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    emptyTitle: {
        color: "#FFF",
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 8,
    },
    emptySubtitle: {
        color: "#8E8EA0",
        fontSize: 14,
    },
});

export default AlertsScreen;
